import { Buffer } from "node:buffer";
import { Keypair } from "@solana/web3.js";
import { createKeyPairSignerFromBytes } from "@solana/signers";
import {
  createPaymentHeader,
  selectPaymentRequirements,
  x402Version as DEFAULT_X402_VERSION,
} from "x402";
import { decodeXPaymentResponse } from "x402/shared";
import {
  PaymentRequirementsSchema,
  type Network,
  type PaymentRequirements,
  type Signer,
} from "x402/types";
import { KeypairWallet, type SolanaAgentKit } from "solana-agent-kit";

const SVM_NETWORKS: Network[] = ["solana", "solana-devnet"];
const signerCache = new WeakMap<SolanaAgentKit, Promise<Signer>>();

type JsonLike = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

type PaymentChallenge = {
  version: number;
  requirements: PaymentRequirements[];
};

export interface PaymentRequestResult {
  data: JsonLike;
  paymentInfo: ReturnType<typeof decodeXPaymentResponse> | null;
  status: number;
  headers: Record<string, string>;
}

export interface PaymentInfoResult {
  challenge: {
    requirement: PaymentRequirements;
    version: number;
  } | null;
  paymentResponse: ReturnType<typeof decodeXPaymentResponse> | null;
}

/**
 * Make an x402-protected request, automatically paying with the agent wallet when required.
 */
export async function makeX402PaymentRequest(
  agent: SolanaAgentKit,
  baseURL: string,
  endpointPath: string,
): Promise<PaymentRequestResult> {
  const url = buildUrl(baseURL, endpointPath);

  const initialResponse = await fetch(url, { method: "GET" });
  if (initialResponse.status !== 402) {
    return buildSuccessPayload(initialResponse);
  }

  const challenge = await parsePaymentChallenge(initialResponse);
  const requirement = pickSolanaRequirement(agent, challenge.requirements);
  const signer = await getSigner(agent);
  const paymentHeader = await createPaymentHeader(signer, challenge.version, requirement);

  const retryHeaders = new Headers({
    "X-PAYMENT": paymentHeader,
    "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
  });

  const paidResponse = await fetch(url, {
    method: "GET",
    headers: retryHeaders,
  });

  if (paidResponse.status === 402) {
    throw new Error("Payment was attempted but the server still returned HTTP 402");
  }

  return buildSuccessPayload(paidResponse);
}

/**
 * Retrieve payment metadata for a protected endpoint without executing the payment.
 */
export async function getX402PaymentInfo(
  agent: SolanaAgentKit,
  baseURL: string,
  endpointPath: string,
): Promise<PaymentInfoResult> {
  const url = buildUrl(baseURL, endpointPath);

  const headResponse = await fetch(url, { method: "HEAD" });
  const header = headResponse.headers.get("x-payment-response");
  if (header) {
    return {
      challenge: null,
      paymentResponse: decodeXPaymentResponse(header),
    };
  }

  if (headResponse.status !== 402) {
    return {
      challenge: null,
      paymentResponse: null,
    };
  }

  const challengeResponse = await fetch(url, { method: "GET" });
  if (challengeResponse.status !== 402) {
    const paymentHeader = challengeResponse.headers.get("x-payment-response");
    return {
      challenge: null,
      paymentResponse: paymentHeader
        ? decodeXPaymentResponse(paymentHeader)
        : null,
    };
  }

  const challenge = await parsePaymentChallenge(challengeResponse);
  const requirement = pickSolanaRequirement(agent, challenge.requirements);

  return {
    challenge: {
      requirement,
      version: challenge.version,
    },
    paymentResponse: null,
  };
}

function buildUrl(baseURL: string, endpointPath: string): string {
  try {
    return new URL(endpointPath, ensureTrailingSlash(baseURL)).toString();
  } catch (error) {
    throw new Error(`Invalid URL for x402 request: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function ensureTrailingSlash(url: string): string {
  if (!url.endsWith("/")) {
    return `${url}/`;
  }
  return url;
}

async function buildSuccessPayload(response: Response): Promise<PaymentRequestResult> {
  const paymentHeader = response.headers.get("x-payment-response");
  const paymentInfo = paymentHeader ? decodeXPaymentResponse(paymentHeader) : null;
  const data = await parseResponseBody(response);

  return {
    data,
    paymentInfo,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  };
}

async function parseResponseBody(response: Response): Promise<JsonLike> {
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    if (contentType.includes("text/")) {
      return await response.text();
    }
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch (error) {
    throw new Error(`Unable to parse response body: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function parsePaymentChallenge(response: Response): Promise<PaymentChallenge> {
  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch (error) {
    throw new Error(
      `Failed to parse x402 challenge payload: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("x402 challenge payload is malformed");
  }

  const record = parsed as Record<string, unknown>;
  const accepts = Array.isArray(record.accepts) ? record.accepts : [];
  if (accepts.length === 0) {
    throw new Error("x402 challenge did not provide any payment requirements");
  }

  const requirements = accepts.map((entry) => PaymentRequirementsSchema.parse(entry));
  const version = typeof record.x402Version === "number" ? record.x402Version : DEFAULT_X402_VERSION;

  return { version, requirements };
}

function pickSolanaRequirement(
  agent: SolanaAgentKit,
  requirements: PaymentRequirements[],
): PaymentRequirements {
  const solanaRequirements = requirements.filter((req) => SVM_NETWORKS.includes(req.network));
  if (solanaRequirements.length === 0) {
    throw new Error("No Solana-compatible payment requirement found in x402 challenge");
  }

  const preferredNetwork = inferSvmNetwork(agent);
  return selectPaymentRequirements(solanaRequirements, preferredNetwork, "exact");
}

function inferSvmNetwork(agent: SolanaAgentKit): Network {
  const endpoint = ((agent.connection as unknown as { _rpcEndpoint?: string })?._rpcEndpoint ?? "")
    .toLowerCase();

  if (endpoint.includes("devnet") || endpoint.includes("localhost") || endpoint.includes("127.0.0.1")) {
    return "solana-devnet";
  }

  return "solana";
}

async function getSigner(agent: SolanaAgentKit): Promise<Signer> {
  const cached = signerCache.get(agent);
  if (cached) {
    return cached;
  }

  const signerPromise = createSignerFromAgent(agent);
  signerCache.set(agent, signerPromise);
  return signerPromise;
}

async function createSignerFromAgent(agent: SolanaAgentKit): Promise<Signer> {
  const wallet = agent.wallet;

  if (wallet instanceof KeypairWallet) {
    const payer = (wallet as unknown as { payer?: Keypair }).payer;
    if (payer?.secretKey) {
      return (await createKeyPairSignerFromBytes(payer.secretKey)) as unknown as Signer;
    }
  }

  const secretKey = (wallet as unknown as { secretKey?: Uint8Array }).secretKey;
  if (secretKey) {
    return (await createKeyPairSignerFromBytes(secretKey)) as unknown as Signer;
  }

  throw new Error(
    "Payments plugin requires a KeypairWallet or compatible signer with accessible secret key to fulfil x402 payments.",
  );
}
