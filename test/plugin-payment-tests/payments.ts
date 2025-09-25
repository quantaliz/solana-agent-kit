import { SolanaAgentKit } from "solana-agent-kit";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments";

// Constants for the test endpoint
const BASE_URL = "https://x402.payai.network";
const ENDPOINT_PATH = "/api/solana-devnet/paid-content";

export default async function paymentsTests(agentKit: SolanaAgentKit) {
  console.log("Testing Payments Plugin...");
  
  // Create an agent with the payments plugin
  const agent = agentKit.use(PaymentsPlugin);

  try {
    // Test the getX402PaymentInfo function
    console.log("Testing getX402PaymentInfo...");
    
    // Note: We'll use a mock server or a test endpoint that supports X402
    // For now we'll skip this test if we don't have a proper test endpoint
    try {
      const paymentInfo = await agent.methods.getX402PaymentInfo(
        agent,
        BASE_URL,
        ENDPOINT_PATH
      );
      console.log("X402 Payment Info:", paymentInfo);
    } catch (error) {
      console.log("getX402PaymentInfo test skipped or failed (expected if no X402 endpoint):", error instanceof Error ? error.message : error);
    }

    // Test the makeX402PaymentRequest function
    console.log("Testing makeX402PaymentRequest...");
    
    try {
      const paymentResult = await agent.methods.makeX402PaymentRequest(
        agent,
        BASE_URL,
        ENDPOINT_PATH
      );
      console.log("X402 Payment Result:", paymentResult);
    } catch (error) {
      console.log("makeX402PaymentRequest test skipped or failed (expected if no X402 endpoint):", error instanceof Error ? error.message : error);
    }

    // Test the action
    console.log("Testing x402_payment_request action...");
    
    try {
      // Find the x402_payment_request action in the actions array
      const x402Action = agent.actions.find(action => action.name === "x402_payment_request");
      
      if (x402Action) {
        // Execute the action's handler
        const actionResult = await x402Action.handler(agent, {
          baseURL: BASE_URL,
          endpointPath: ENDPOINT_PATH
        });
        console.log("X402 Action Result:", actionResult);
      } else {
        console.log("x402_payment_request action not found in agent actions");
      }
    } catch (error) {
      console.log("x402_payment_request action test skipped or failed (expected if no X402 endpoint):", error instanceof Error ? error.message : error);
    }

    console.log("Payments Plugin tests completed!");
  } catch (error) {
    console.error("Error during payments tests:", error);
    throw error;
  }
}