import axios from "axios";
import type { Hex, Signer, MultiNetworkSigner } from "x402-axios";
import { withPaymentInterceptor, decodeXPaymentResponse, createSigner } from "x402-axios";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Custom signer that works with SolanaAgentKit's wallet
 */
class WalletSigner implements Signer {
  private wallet: any; // Using any because we need to check if getSecretKey exists at runtime
  private network: string;

  constructor(wallet: any, network: string = "solana-devnet") {
    this.wallet = wallet;
    this.network = network;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    // Use the wallet's signMessage function if available
    if (this.wallet.signMessage) {
      return await this.wallet.signMessage(message);
    } else {
      throw new Error("Wallet does not support signing messages");
    }
  }

  async signTransaction(transaction: any): Promise<any> {
    // Use the wallet's signTransaction function if available
    if (this.wallet.signTransaction) {
      return await this.wallet.signTransaction(transaction);
    } else {
      throw new Error("Wallet does not support signing transactions");
    }
  }

  get publicKey(): string {
    return this.wallet.publicKey.toBase58();
  }
}

/**
 * Make a payment-enabled request using x402-axios
 * @param agent - The SolanaAgentKit instance
 * @param baseURL - The base URL of the resource server
 * @param endpointPath - The path of the endpoint to call
 * @returns The response data and payment information
 */
export async function makeX402PaymentRequest(
  agent: SolanaAgentKit,
  baseURL: string,
  endpointPath: string
): Promise<{ data: any; paymentInfo: any }> {
  try {
    // Create a signer using the agent's wallet
    const walletSigner = new WalletSigner(agent.wallet, "solana-devnet");
    
    // Create an axios instance with the payment interceptor
    const api = withPaymentInterceptor(
      axios.create({
        baseURL,
      }),
      walletSigner,
    );
    
    // Make the request
    const response = await api.get(endpointPath);
    
    // Decode the payment response
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    
    return {
      data: response.data,
      paymentInfo: paymentResponse
    };
  } catch (error) {
    console.error("Error making payment request:", error);
    throw new Error(`Payment request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get payment information for a resource
 * @param agent - The SolanaAgentKit instance
 * @param baseURL - The base URL of the resource server
 * @param endpointPath - The path of the endpoint to call
 * @returns Payment information
 */
export async function getX402PaymentInfo(
  agent: SolanaAgentKit,
  baseURL: string,
  endpointPath: string
): Promise<any> {
  try {
    // Create a signer using the agent's wallet
    const walletSigner = new WalletSigner(agent.wallet, "solana-devnet");
    
    // Create an axios instance with the payment interceptor
    const api = withPaymentInterceptor(
      axios.create({
        baseURL,
      }),
      walletSigner,
    );
    
    // Make a HEAD request to get payment information without fetching the full resource
    const response = await api.head(endpointPath);
    
    // Decode the payment response
    const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
    
    return paymentResponse;
  } catch (error) {
    console.error("Error getting payment info:", error);
    throw new Error(`Failed to get payment info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}