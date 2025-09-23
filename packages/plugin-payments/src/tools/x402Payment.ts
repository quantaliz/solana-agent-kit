import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse, createSigner, type Hex } from "x402-axios";
import { SolanaAgentKit } from "solana-agent-kit";

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
    // Get the private key from the agent's wallet
    const privateKey = agent.wallet.getSecretKey() as unknown as Hex;
    
    // Create a signer using the agent's network
    const signer = await createSigner("solana-devnet", privateKey);
    
    // Create an axios instance with the payment interceptor
    const api = withPaymentInterceptor(
      axios.create({
        baseURL,
      }),
      signer,
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
    // Get the private key from the agent's wallet
    const privateKey = agent.wallet.getSecretKey() as unknown as Hex;
    
    // Create a signer using the agent's network
    const signer = await createSigner("solana-devnet", privateKey);
    
    // Create an axios instance with the payment interceptor
    const api = withPaymentInterceptor(
      axios.create({
        baseURL,
      }),
      signer,
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