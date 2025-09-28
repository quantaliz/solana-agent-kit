import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import type { SolanaAgentKit } from "solana-agent-kit";
import type { PaymentRequirements } from "x402/types";
import { PaymentRequirementsSchema } from "x402/types";

const BASE_URL = "https://x402.mock";
const ENDPOINT_PATH = "/protected-resource";
const FULL_URL = `${BASE_URL}${ENDPOINT_PATH}`;

interface FetchExpectation {
  description: string;
  assert(requestInfo: RequestInfo, init?: RequestInit): void;
  respond(): Response;
}

function toUrlString(requestInfo: RequestInfo): string {
  if (typeof requestInfo === "string") {
    return requestInfo;
  }
  if (requestInfo instanceof URL) {
    return requestInfo.toString();
  }
  return requestInfo.url;
}

function readHeader(init: RequestInit | undefined, name: string): string | null {
  if (!init?.headers) {
    return null;
  }

  const headers = new Headers(init.headers as HeadersInit);
  return headers.get(name);
}

async function withMockedFetch<T>(expectations: FetchExpectation[], fn: () => Promise<T>): Promise<T> {
  const originalFetch = globalThis.fetch;
  let callIndex = 0;

  globalThis.fetch = (async (requestInfo: RequestInfo, init?: RequestInit): Promise<Response> => {
    const expectation = expectations[callIndex];
    assert.ok(expectation, `Unexpected fetch call for ${toUrlString(requestInfo)}`);

    expectation.assert(requestInfo, init);
    callIndex += 1;
    return expectation.respond();
  }) as typeof fetch;

  try {
    const result = await fn();
    assert.strictEqual(callIndex, expectations.length, "Not all expected fetch calls were executed");
    return result;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function buildRequirement(payTo: string): PaymentRequirements {
  const requirementInput = {
    scheme: "exact" as const,
    network: "solana-devnet" as const,
    maxAmountRequired: "5",
    resource: "https://merchant.mock/api/resource",
    description: "Premium data",
    mimeType: "application/json",
    outputSchema: undefined,
    payTo,
    maxTimeoutSeconds: 30,
    asset: payTo,
    extra: { memo: "unit-test" },
  };

  return PaymentRequirementsSchema.parse(requirementInput);
}

function encodePaymentResponse(response: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(response)).toString("base64");
}

export default async function paymentsTests(agent: SolanaAgentKit): Promise<void> {
  console.log("Running payments plugin tests with mocked x402 server...");

  const signerAddress = agent.wallet.publicKey.toBase58();
  const requirement = buildRequirement(signerAddress);
  const challengePayload = {
    x402Version: 1,
    accepts: [requirement],
  };
  const paymentReceipt = {
    success: true,
    transaction: "dummy",
    network: "solana-devnet",
  };
  const encodedReceipt = encodePaymentResponse(paymentReceipt);

  await testGetInfoFromResponseHeader(agent, encodedReceipt);
  await testGetInfoFromChallenge(agent, challengePayload, requirement);
  await testMakePaymentRequest(agent, challengePayload, requirement, encodedReceipt, paymentReceipt);
  await testActionHandler(agent, challengePayload, requirement, encodedReceipt, paymentReceipt);

  console.log("Payments plugin tests completed!\n");
}

async function testGetInfoFromResponseHeader(
  agent: SolanaAgentKit,
  encodedReceipt: string,
): Promise<void> {
  await withMockedFetch(
    [
      {
        description: "HEAD returns existing receipt",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "HEAD");
        },
        respond() {
          return new Response(null, {
            status: 200,
            headers: {
              "x-payment-response": encodedReceipt,
            },
          });
        },
      },
    ],
    async () => {
      const info = await agent.methods.getX402PaymentInfo(agent, BASE_URL, ENDPOINT_PATH);

      assert.strictEqual(info.challenge, null);
      assert.deepStrictEqual(info.paymentResponse, JSON.parse(Buffer.from(encodedReceipt, "base64").toString("utf8")));
      console.log("✓ getX402PaymentInfo returns decoded header when present");
    },
  );
}

async function testGetInfoFromChallenge(
  agent: SolanaAgentKit,
  challengePayload: { x402Version: number; accepts: PaymentRequirements[] },
  requirement: PaymentRequirements,
): Promise<void> {
  await withMockedFetch(
    [
      {
        description: "HEAD returns 402",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "HEAD");
        },
        respond() {
          return new Response(null, { status: 402 });
        },
      },
      {
        description: "GET returns challenge",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "GET");
        },
        respond() {
          return new Response(JSON.stringify(challengePayload), {
            status: 402,
            headers: { "content-type": "application/json" },
          });
        },
      },
    ],
    async () => {
      const info = await agent.methods.getX402PaymentInfo(agent, BASE_URL, ENDPOINT_PATH);

      assert.ok(info.challenge);
      assert.strictEqual(info.challenge!.version, challengePayload.x402Version);
      assert.deepStrictEqual(info.challenge!.requirement, requirement);
      assert.strictEqual(info.paymentResponse, null);
      console.log("✓ getX402PaymentInfo parses x402 challenge when header absent");
    },
  );
}

async function testMakePaymentRequest(
  agent: SolanaAgentKit,
  challengePayload: { x402Version: number; accepts: PaymentRequirements[] },
  requirement: PaymentRequirements,
  encodedReceipt: string,
  paymentReceipt: Record<string, unknown>,
): Promise<void> {
  await withMockedFetch(
    [
      {
        description: "Initial GET returns 402",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "GET");
        },
        respond() {
          return new Response(JSON.stringify(challengePayload), {
            status: 402,
            headers: { "content-type": "application/json" },
          });
        },
      },
      {
        description: "Retry includes X-PAYMENT header",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "GET");
          const paymentHeader = readHeader(init, "x-payment");
          assert.ok(paymentHeader, "Expected X-PAYMENT header on retry request");
          assert.strictEqual(readHeader(init, "access-control-expose-headers"), "X-PAYMENT-RESPONSE");
          assert.ok(paymentHeader!.length > 0);
        },
        respond() {
          return new Response(JSON.stringify({ paid: true }), {
            status: 200,
            headers: {
              "content-type": "application/json",
              "x-payment-response": encodedReceipt,
            },
          });
        },
      },
    ],
    async () => {
      const result = await agent.methods.makeX402PaymentRequest(agent, BASE_URL, ENDPOINT_PATH);

      assert.strictEqual(result.status, 200);
      assert.deepStrictEqual(result.data, { paid: true });
      assert.deepStrictEqual(result.paymentInfo, paymentReceipt);
      assert.strictEqual(result.headers["x-payment-response"], encodedReceipt);
      assert.deepStrictEqual(result.paymentInfo, paymentReceipt);
      console.log("✓ makeX402PaymentRequest retries with payment header and parses response");
    },
  );
}

async function testActionHandler(
  agent: SolanaAgentKit,
  challengePayload: { x402Version: number; accepts: PaymentRequirements[] },
  requirement: PaymentRequirements,
  encodedReceipt: string,
  paymentReceipt: Record<string, unknown>,
): Promise<void> {
  const action = agent.actions.find((entry) => entry.name === "x402_payment_request");
  assert.ok(action, "x402_payment_request action should be registered");

  await withMockedFetch(
    [
      {
        description: "Initial GET returns 402",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "GET");
        },
        respond() {
          return new Response(JSON.stringify(challengePayload), {
            status: 402,
            headers: { "content-type": "application/json" },
          });
        },
      },
      {
        description: "Retry includes X-PAYMENT header",
        assert(requestInfo, init) {
          assert.strictEqual(toUrlString(requestInfo), FULL_URL);
          assert.strictEqual(init?.method ?? "GET", "GET");
          const paymentHeader = readHeader(init, "x-payment");
          assert.ok(paymentHeader, "Expected X-PAYMENT header on retry request");
        },
        respond() {
          return new Response(JSON.stringify({ paid: true }), {
            status: 200,
            headers: {
              "content-type": "application/json",
              "x-payment-response": encodedReceipt,
            },
          });
        },
      },
    ],
    async () => {
      const result = await action!.handler(agent, {
        baseURL: BASE_URL,
        endpointPath: ENDPOINT_PATH,
      });

      assert.deepStrictEqual(result, {
        headers: { "x-payment-response": encodedReceipt },
        paymentInfo: paymentReceipt,
        status: 200,
      });
      console.log("✓ x402_payment_request action delegates to makeX402PaymentRequest");
    },
  );
}
