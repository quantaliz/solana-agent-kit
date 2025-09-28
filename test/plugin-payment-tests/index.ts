import PaymentsPlugin from "../../packages/plugin-payments/src/index";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import { KeypairWallet, SolanaAgentKit } from "solana-agent-kit";
import paymentsTests from "./payments";

dotenv.config();

function createKeypair(): Keypair {
  const secret = process.env.SOLANA_PRIVATE_KEY;
  if (secret) {
    return Keypair.fromSecretKey(bs58.decode(secret));
  }

  console.warn("SOLANA_PRIVATE_KEY not set; generating an ephemeral keypair for tests.");
  return Keypair.generate();
}

async function main() {
  // Use a mock URL to prevent actual blockchain calls during x402 testing
  const mockRpcUrl = "http://localhost:9999"; // Using a non-existent RPC to mock behavior
  const keyPair = createKeypair();
  // Ensure we're passing the keypair directly to KeypairWallet
  const wallet = new KeypairWallet(keyPair, mockRpcUrl);

  const agent = new SolanaAgentKit(wallet, mockRpcUrl, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }).use(PaymentsPlugin);

  await paymentsTests(agent);
}

main()
  .then(() => console.log("Payment tests completed successfully!"))
  .catch((error) => {
    console.error("Error during payment tests:", error);
    process.exit(1);
  });
