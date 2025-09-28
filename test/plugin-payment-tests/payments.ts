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
    const url = toUrlString(requestInfo);
    
    // Check if this is a Solana RPC call (should return mock data)
    const isSolanaRpcCall = url.includes('solana.com') || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('9999'); // Include our mock URL
    
    if (isSolanaRpcCall) {
      // Handle Solana RPC calls with mock responses
      // Parse the request body to determine the method
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const method = body?.method;
      
      // Check if this is a getAccountInfo call for a specific address
      if (method === 'getAccountInfo') {
        const address = body?.params?.[0];
        
        // For the token mint account, we need to return properly formatted account data
        // that can be decoded as a Mint account by the x402 library
        
        // Solana Mint account layout:
        // [0]    - isInitialized: u8 (1 byte)
        // [1]    - decimals: u8 (1 byte) 
        // [2]    - mintAuthorityOption: u8 (1 byte) - 0 = None, 1 = Option< Pubkey >
        // [3-34] - mintAuthority: [u8; 32] (32 bytes if option = 1)
        // [35-42]- supply: u64 (8 bytes)
        // [43]   - freezeAuthorityOption: u8 (1 byte)
        // [44-75] or [] - freezeAuthority: [u8; 32] (32 bytes if option = 1)
        
        // Create buffer with the proper layout
        const buffer = new ArrayBuffer(82); // Minimum size for a mint with authorities
        const view = new DataView(buffer);
        const mintData = new Uint8Array(buffer);
        
        // isInitialized = true
        view.setUint8(0, 1);
        // decimals = 9 
        view.setUint8(1, 9);
        // mintAuthorityOption = 1 (has authority)
        view.setUint8(2, 1);
        // Set the mint authority to some valid public key bytes (all zeros for test)
        mintData.fill(0, 3, 35);
        // supply = 1000000000 (as an example)
        view.setBigUint64(35, BigInt(1000000000), true); // little endian
        // freezeAuthorityOption = 0 (no freeze authority)
        view.setUint8(43, 0);
        
        const base64Data = Buffer.from(mintData).toString('base64');

        const mockAccountData = {
          "jsonrpc": "2.0",
          "result": {
            "context": {"slot": 123456789},
            "value": {
              "data": [base64Data, "base64"],
              "executable": false,
              "lamports": 1000000000,
              "owner": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // Token-2022 Program
              "rentEpoch": 0
            }
          },
          "id": body.id
        };
        
        return new Response(JSON.stringify(mockAccountData), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      } else if (method === 'getLatestBlockhash') {
        const mockBlockhash = {
          "jsonrpc": "2.0",
          "result": {
            "context": {"slot": 123456789},
            "value": {
              "blockhash": "Eays7J49DZD76X1PLH8UKgPq2CZfj9121R817qBQ6412",
              "lastValidBlockHeight": 123456790
            }
          },
          "id": body.id
        };
        return new Response(JSON.stringify(mockBlockhash), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      } else if (method === 'simulateTransaction') {
        // Handle the transaction simulation call
        const mockSimulationResult = {
          "jsonrpc": "2.0",
          "result": {
            "context": {"slot": 123456789},
            "value": {
              "err": null,  // No error in simulation
              "logs": [],
              "accounts": null,
              "unitsConsumed": 123456,
              "returnData": null
            }
          },
          "id": body.id
        };
        return new Response(JSON.stringify(mockSimulationResult), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      } else {
        // For other methods, return a generic mock response
        return new Response(JSON.stringify({
          "jsonrpc": "2.0", 
          "result": {
            "context": {"slot": 123456789},
            "value": method === 'getSlot' ? 123456789 : {}  // Special case for getSlot
          },
          "id": body.id
        }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    }
    
    // Handle expected x402 HTTP requests
    const expectation = expectations[callIndex];
    assert.ok(expectation, `Unexpected fetch call for ${url}`);

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
    asset: "So11111111111111111111111111111111111111112", // Native SOL address
    extra: { 
      memo: "unit-test",
      feePayer: payTo  // Add the required feePayer field
    },
  };

  // Remove undefined outputSchema as Zod schema might strip it
  const parsed = PaymentRequirementsSchema.parse(requirementInput);
  if (parsed.outputSchema === undefined) {
    delete (parsed as any).outputSchema;
  }
  
  return parsed;
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
