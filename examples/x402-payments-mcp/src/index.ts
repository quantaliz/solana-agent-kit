import * as dotenv from "dotenv";
import { SolanaAgentKit, KeypairWallet, Action } from "solana-agent-kit";
// @ts-ignore
import { startMcpServer, McpServer } from "@solana-agent-kit/adapter-mcp";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

dotenv.config();

if (!process.env.SOLANA_PRIVATE_KEY) {
  throw new Error("Please set your SOLANA_PRIVATE_KEY in .env");
}

if (!process.env.RPC_URL) {
  throw new Error("Please set your RPC_URL in .env");
}

// Initialize wallet
const decodedPrivateKey = bs58.decode(process.env.SOLANA_PRIVATE_KEY as string);
const keypair = Keypair.fromSecretKey(decodedPrivateKey);
const keypairWallet = new KeypairWallet(keypair, process.env.RPC_URL as string);

// Initialize Solana Agent Kit with payments plugin
const agent = new SolanaAgentKit(
  keypairWallet,
  process.env.RPC_URL as string,
  {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  }
).use(PaymentsPlugin); // Add the payments plugin

// Prepare actions for MCP server
// You can either expose all actions or specific ones
const mcpActions: Record<string, Action> = {};

// Option 1: Add all agent actions (including payment actions)
for (const action of agent.actions) {
  mcpActions[action.name] = action;
}

// Option 2: Select specific actions (comment out the above loop and use this instead)
/*
const mcpActions: Record<string, Action> = {
  // Token actions
  BALANCE_ACTION: agent.actions.find((action) => action.name === "BALANCE_ACTION")!,
  TOKEN_BALANCE_ACTION: agent.actions.find((action) => action.name === "TOKEN_BALANCE_ACTION")!,
  GET_WALLET_ADDRESS_ACTION: agent.actions.find((action) => action.name === "GET_WALLET_ADDRESS_ACTION")!,

  // Payment actions
  X402_PAYMENT_ACTION: agent.actions.find((action) => action.name === "X402_PAYMENT_ACTION")!,
};
*/

console.log(`🚀 Starting MCP server with ${Object.keys(mcpActions).length} actions...`);
console.log(`📋 Available actions: ${Object.keys(mcpActions).join(', ')}`);

// Start the MCP server
startMcpServer(mcpActions, agent, { name: "solana-agent-payments", version: "1.0.0" })
  .then((server: McpServer) => {
    console.log("✅ MCP server started successfully!");
    console.log("💡 The server is now ready to handle requests from MCP-compatible AI assistants");
  })
  .catch((error: unknown) => {
    console.error("❌ Error starting MCP server:", error);
    process.exit(1);
  });

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MCP server...');
  process.exit(0);
});