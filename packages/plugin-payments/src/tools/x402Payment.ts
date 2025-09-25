import axios from "axios";
import type { Hex, Signer, MultiNetworkSigner } from "x402-axios";
import { withPaymentInterceptor, decodeXPaymentResponse, createSigner } from "x402-axios";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Custom implementation for making X402 payment requests using SolanaAgentKit's wallet
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
  // For now, we'll use a simplified approach without a private key
  // The complete x402 implementation would require deeper integration
  // that respects the wallet's security model
  
  try {
    // Create a temporary axios instance without the payment interceptor
    // since we can't get the private key from the wallet for security reasons
    const api = axios.create({
      baseURL,
    });
    
    // Make the request - this will likely result in a 402 Payment Required response
    // which we then handle by making the required payment transaction
    const response = await api.get(endpointPath);
    
    // If the server sends x-payment-response header, decode it
    if (response.headers["x-payment-response"]) {
      const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
      return {
        data: response.data,
        paymentInfo: paymentResponse
      };
    } else {
      // If no payment response header, return the data as is
      return {
        data: response.data,
        paymentInfo: null
      };
    }
  } catch (error: any) {
    // If we get a 402 error, we need to handle the payment
    if (error?.response?.status === 402) {
      // This is where we would implement the actual payment logic
      // using SolanaAgentKit's wallet, but this requires specific
      // integration with the x402 protocol that's beyond our current
      // ability without access to private keys
      
      // For now, re-throw the error
      console.error("Payment required but cannot process without private key access:", error.message);
      throw new Error(`Payment required but cannot be processed: ${error.message}`);
    }
    
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
    // Create a temporary axios instance without the payment interceptor
    const api = axios.create({
      baseURL,
    });
    
    // Make a HEAD request to get payment information without fetching the full resource
    const response = await api.head(endpointPath);
    
    // If the server sends x-payment-response header, decode it
    if (response.headers["x-payment-response"]) {
      const paymentResponse = decodeXPaymentResponse(response.headers["x-payment-response"]);
      return paymentResponse;
    } else {
      return null;
    }
  } catch (error: any) {
    // If we get a 402 error, we need to handle the payment
    if (error?.response?.status === 402) {
      // For a HEAD request, we might still get payment information in the headers
      if (error?.response?.headers?.["x-payment-response"]) {
        const paymentResponse = decodeXPaymentResponse(error.response.headers["x-payment-response"]);
        return paymentResponse;
      }
    }
    
    console.error("Error getting payment info:", error);
    throw new Error(`Failed to get payment info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}