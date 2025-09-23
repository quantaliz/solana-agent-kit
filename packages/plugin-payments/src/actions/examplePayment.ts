import { Action } from "solana-agent-kit";
import { z } from "zod";

const examplePaymentSchema = z.object({
  recipient: z.string().describe("The recipient's wallet address"),
  amount: z.number().describe("The amount to send"),
});

const examplePaymentAction: Action = {
  name: "example_payment",
  similes: ["send payment", "make payment", "transfer funds"],
  description: "Example action to demonstrate payment functionality",
  examples: [
    [
      {
        input: {
          recipient: "8x2dR8MpzQ0QY5Qe89gF6yWn8wJqKgQ5QpXr9zYwQ5Qp",
          amount: 100,
        },
        output: {
          signature: "example_signature",
          message: "Payment processed successfully",
        },
        explanation: "This example shows how to send a payment",
      },
    ],
  ],
  schema: examplePaymentSchema,
  handler: async (agent, input) => {
    // This is just a placeholder implementation
    // In a real implementation, you would call the actual payment method
    const { recipient, amount } = examplePaymentSchema.parse(input);
    console.log(`Processing payment of ${amount} to ${recipient}`);
    return {
      signature: "example_signature",
      message: "Payment processed successfully",
    };
  },
};

export default examplePaymentAction;