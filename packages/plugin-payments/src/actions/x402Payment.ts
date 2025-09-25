import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";

const x402PaymentSchema = z.object({
  baseURL: z.string().describe("The base URL of the resource server"),
  endpointPath: z.string().describe("The path of the endpoint to call"),
});

const x402PaymentAction: Action = {
  name: "x402_payment_request",
  similes: ["make payment request", "x402 request", "payment protected request"],
  description: "Make a request to a resource protected by x402 payment protocol",
  examples: [
    [
      {
        input: {
          baseURL: "https://example.com",
          endpointPath: "/weather",
        },
        output: {
          data: { temperature: 25, condition: "sunny" },
          paymentInfo: { amount: "1000", recipient: "7dRXJd2pmzpPzXx7Dxo1oapVGRF4jXsWeKRnRegKSfM7" },
          message: "Request successful",
        },
        explanation: "This example shows how to make a payment request to a weather API protected by x402",
      },
    ],
  ],
  schema: x402PaymentSchema as any, // Cast to any to avoid Zod version incompatibility
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    // Import the tool function dynamically to avoid circular dependencies
    const { makeX402PaymentRequest } = await import("../tools/x402Payment");
    
    try {
      const parsedInput = x402PaymentSchema.parse(input);
      const result = await makeX402PaymentRequest(agent, parsedInput.baseURL, parsedInput.endpointPath);
      
      return {
        data: result.data,
        paymentInfo: result.paymentInfo,
        message: "Request successful",
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Request failed",
      };
    }
  },
};

export default x402PaymentAction;