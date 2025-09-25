import PaymentsPlugin from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import { KeypairWallet, SolanaAgentKit } from "solana-agent-kit";
import paymentsTests from "./payments";

dotenv.config();

function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["RPC_URL", "SOLANA_PRIVATE_KEY"];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
}

validateEnvironment();

async function main() {
  const keyPair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY as string),
  );
  const wallet = new KeypairWallet(keyPair, process.env.RPC_URL as string);

  // Initialize agent with your test wallet
  const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  })
    // Load only the payments plugin for this test
    .use(PaymentsPlugin);

  await paymentsTests(agent);
}

main()
  .then(() => console.log("Payment tests completed successfully!"))
  .catch((error) => {
    console.error("Error during payment tests:", error);
    process.exit(1);
  });