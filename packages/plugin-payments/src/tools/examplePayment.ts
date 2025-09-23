import { SolanaAgentKit } from "solana-agent-kit";

/**
 * Example payment method
 * @param agent - The SolanaAgentKit instance
 * @param recipient - The recipient's wallet address
 * @param amount - The amount to send
 * @returns A transaction signature
 */
export async function examplePaymentMethod(
  agent: SolanaAgentKit,
  recipient: string,
  amount: number
): Promise<string> {
  // This is just a placeholder implementation
  // In a real implementation, you would create and send a transaction
  console.log(`Processing payment of ${amount} to ${recipient}`);
  return "example_signature";
}