import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * X402 Payment Example
 * 
 * This example demonstrates how to set up and use the x402 payment functionality
 * in the Solana Agent Kit. The x402 protocol enables automated payments between
 * agents using Solana blockchain for web APIs that require payment.
 */

async function main() {
  console.log("🚀 Starting X402 Payment Example...\n");

  // 1. WALLET SETUP
  // ----------------
  // Create a wallet using a secret key or generate a new one
  // IMPORTANT: In production, use a wallet with actual SOL/Token balance
  let secretKey: Uint8Array;
  
  if (process.env.SOLANA_PRIVATE_KEY) {
    secretKey = bs58.decode(process.env.SOLANA_PRIVATE_KEY);
    console.log("✅ Using private key from environment variable");
  } else {
    // Generate a new keypair for testing (will need to be funded manually)
    const keypair = Keypair.generate();
    secretKey = keypair.secretKey;
    console.log("⚠️  Generated new keypair for testing (requires funding)");
    console.log("Public key:", keypair.publicKey.toBase58());
  }

  // Create wallet instance
  const keypair = Keypair.fromSecretKey(secretKey);
  const wallet = new KeypairWallet(keypair);
  console.log("✅ Wallet created\n");

  // 2. AGENT INITIALIZATION
  // -----------------------
  // Initialize the Solana Agent Kit with the wallet and RPC URL
  const rpcUrl = process.env.RPC_URL || "https://api.devnet.solana.com";
  const agent = new SolanaAgentKit(
    wallet,
    rpcUrl,
    {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    }
  )
  // Add the payments plugin to enable x402 functionality
  .use(PaymentsPlugin);

  console.log("✅ Solana Agent Kit initialized with Payments Plugin\n");

  // 3. X402 PAYMENT EXAMPLE
  // ------------------------
  // Demonstrate making an x402-protected API request
  console.log("📋 Example: Making an X402 Payment Request");
  console.log("   This will attempt to access a resource that requires payment via x402 protocol");
  
  try {
    // This example makes a payment request to a protected resource
    // The x402 protocol will automatically handle payment if required
    const result = await agent.methods.makeX402PaymentRequest(
      agent, 
      "https://x402.mock", 
      "/protected-resource"
    );

    console.log("✅ X402 Payment Request Successful!");
    console.log("   Status:", result.status);
    console.log("   Data received:", JSON.stringify(result.data, null, 2));
    console.log("   Payment info:", JSON.stringify(result.paymentInfo, null, 2));
  } catch (error) {
    console.log("⚠️  X402 Payment Request failed (expected in test environment):", error instanceof Error ? error.message : String(error));
  }

  // 4. GET PAYMENT INFO EXAMPLE
  // ----------------------------
  // Retrieve payment metadata without executing payment
  console.log("\n📋 Example: Getting X402 Payment Information");
  
  try {
    const info = await agent.methods.getX402PaymentInfo(
      agent,
      "https://x402.mock", 
      "/protected-resource"
    );

    console.log("✅ X402 Payment Info Retrieved!");
    console.log("   Challenge:", info.challenge ? JSON.stringify(info.challenge, null, 2) : "None");
    console.log("   Payment Response:", info.paymentResponse ? JSON.stringify(info.paymentResponse, null, 2) : "None");
  } catch (error) {
    console.log("⚠️  X402 Payment Info Request failed (expected in test environment):", error instanceof Error ? error.message : String(error));
  }

  // 5. AI INTEGRATION EXAMPLE
  // --------------------------
  // Show how to integrate with AI frameworks using Vercel AI SDK
  console.log("\n📋 Example: AI Integration with Payment Tools");
  
  // Create tools for AI frameworks to use payment functionality
  const tools = createVercelAITools(agent, agent.actions);
  
  // Find x402 payment related tools
  const x402Tools = tools.filter(tool => 
    tool.name.includes('x402') || tool.name.includes('payment')
  );
  
  console.log("✅ Created AI tools for payment functionality");
  console.log("   Available X402 tools:", x402Tools.map(t => t.name).join(", "));
  
  // Example of how an AI agent might use the payment tool
  console.log("\n💡 Example AI usage:");
  console.log("   An AI agent can now use the 'x402_payment_request' tool to automatically");
  console.log("   pay for access to protected APIs that implement the x402 standard.");
  
  console.log("\n🎉 X402 Payment Example Completed!");
  console.log("\n📝 Key Functions Demonstrated:");
  console.log("   - makeX402PaymentRequest: Makes HTTP requests to x402-protected endpoints");
  console.log("   - getX402PaymentInfo: Retrieves payment requirements without paying");
  console.log("   - AI integration: Payment tools available for AI agents");
}

// Run the example
main()
  .then(() => console.log("\n✅ Example executed successfully"))
  .catch((error) => {
    console.error("\n❌ Error during example execution:", error);
    process.exit(1);
  });