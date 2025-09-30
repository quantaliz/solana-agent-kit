<div align="center">

# Solana Agent Kit

## ⚠️ FORK NOTICE: This is a fork of the original repository created for the "Cypherpink" hackathon

**Original Repository**: [https://github.com/sendaifun/solana-agent-kit](https://github.com/sendaifun/solana-agent-kit)

</div>

This fork has been modified to enhance specific functionality for hackathon projects. The primary changes include:

## Payments Plugin - Developed for Cypherpunk
- Add `@solana-agent-kit/plugin-payments` with a production-ready x402 payment pipeline that caches signers, infers the right Solana network, and surfaces both `makeX402PaymentRequest` and `getX402PaymentInfo` so agents can paywall-hop autonomously.
- Delivered first-class agent UX with the `x402_payment_request` action and AI tool wiring, letting everything from Vercel AI SDK flows to MCP deployments tap payments without glue code.
- Built end-to-end mocks and integration tests in `test/plugin-payment-tests/payments.ts` that simulate RPC primitives, 402 challenges, and payment receipts, proving the plugin pays and retries correctly.
- Shipped two battle-tested demos — `examples/x402-payments` for scriptable runs and `examples/x402-payments-mcp` for Claude/Model Context Protocol deployments — complete with environment scaffolding and narrative walkthroughs.
- Hardened packaging and CI posture via updated build targets, TypeScript configs, and dependency hygiene, keeping the workspace compiling cleanly even in constrained environments.
- Added hackathon-ready `docs/x402.md` and storytelling so judges and builders can spin up wallets, run demos, and understand the payments flow start-to-finish.



An open-source toolkit for connecting AI agents to Solana protocols. Now, any agent, using any model can autonomously perform 60+ Solana actions:

- **Make x402 Payments**
- Trade tokens
- Launch new tokens
- Lend assets
- Send compressed airdrops
- Execute blinks
- Launch tokens on AMMs
- Bridge tokens across chains
- And more...

Anyone - whether an SF-based AI researcher or a crypto-native builder - can bring their AI agents trained with any model and seamlessly integrate with Solana.

## 🔧 Core Blockchain Features

- **Token Operations**
  - Deploy SPL tokens by Metaplex
  - Transfer assets
  - Balance checks
  - Stake SOL
  - Zk compressed Airdrop by Light Protocol and Helius
  - Bridge tokens across chains using Wormhole
- **NFTs on 3.Land**
  - Create your own collection
  - NFT creation and automatic listing on 3.land
  - List your NFT for sale in any SPL token
- **NFT Management via Metaplex**
  - Collection deployment
  - NFT minting
  - Metadata management
  - Royalty configuration

- **DeFi Integration**
  - Jupiter Exchange swaps
  - Launch on Pump via PumpPortal
  - Raydium pool creation (CPMM, CLMM, AMMv4)
  - Orca Whirlpool integration
  - Manifest market creation, and limit orders
  - Meteora Dynamic AMM, DLMM Pool, and Alpha Vault
  - Openbook market creation
  - Register and Resolve SNS
  - Jito Bundles
  - Pyth Price feeds for fetching Asset Prices
  - Register/resolve Alldomains
  - Perpetuals Trading with Adrena Protocol
  - Drift Vaults, Perps, Lending and Borrowing
  - Cross-chain bridging via deBridge DLN
  - Cross chain bridging via Wormhole

- **Solana Blinks**
   - Lending by Lulo (Best APR for USDC)
   - Send Arcade Games
   - JupSOL staking
   - Solayer SOL (sSOL)staking

- **Non-Financial Actions**
  - Gib Work for registering bounties

- **Market Data Integration**
  - CoinGecko Pro API integration
  - Real-time token price data
  - Trending tokens and pools
  - Top gainers analysis
  - Token information lookup
  - Latest pool tracking

## 💳 x402 Payments & MCP

- `@solana-agent-kit/plugin-payments` provides the `makeX402PaymentRequest` and `getX402PaymentInfo` helpers plus the `x402_payment_request` action, letting agents answer 402 challenges and retry with signed payment headers automatically.
- Test harness in `test/plugin-payment-tests/payments.ts` mocks Solana RPC calls, verifies signer caching, and asserts the end-to-end payment handshake, so the flow stays regression-proof.
- `examples/x402-payments` walks builders through CLI usage with environment scaffolding, AI tool wiring, and narrative logging for live demos.
- `examples/x402-payments-mcp` turns the same tooling into a Claude-ready MCP server, exposing the full payment surface to desktop AIs with minimal configuration.
- Packaging upgrades ensure the plugin builds cleanly across ESM/CJS targets and integrates with the monorepo’s turbo + pnpm pipeline without OOM hiccups.

## 🤖 AI Integration Features

- **LangChain Integration**
  - Ready-to-use LangChain tools for blockchain operations
  - Autonomous agent support with React framework
  - Memory management for persistent interactions
  - Streaming responses for real-time feedback

- **Vercel AI SDK Integration**
  - Vercel AI SDK for AI agent integration
  - Framework agnostic support
  - Quick and easy toolkit setup

- **Autonomous Modes**
  - Interactive chat mode for guided operations
  - Autonomous mode for independent agent actions
  - Configurable action intervals
  - Built-in error handling and recovery

- **AI Tools**
  - DALL-E integration for NFT artwork generation
  - Natural language processing for blockchain commands
  - Price feed integration for market analysis
  - Automated decision-making capabilities

## 📃 Documentation

You can view the full documentation of the kit at [docs.sendai.fun](https://docs.sendai.fun/v0/introduction)

## Why We Built V2 and Why Upgrade?

The Solana Agent Kit V2 is a major upgrade from V1, to learn why check out our [migration guide](./MIGRATING.md)

## 📦 Core Installation (from this repository source)

```bash
git clone https://github.com/quantaliz/solana-agent-kit
cd solana-agent-kit
(**NOTE**: if using NPM 24+) npm install -g node-gyp
pnpm install
pnpm build
```

If you want to compile the examples:

```bash
pnpm build:examples:payments
pnpm build:examples:payments-mcp
# To run the MCP server
pnpm run:examples:payments-mcp
```

NOTE: If you are having troubles compiling because of "Out-of-Memory", use `NODE_OPTIONS="--max-old-space-size=6144"`

## 📦 Plugin Installation

You can choose to install any of the plugins listed below or you could choose to install all of them to experience the full power of the Solana Agent Kit.

1. Token plugin (`@solana-agent-kit/plugin-token`): Token operations for SPL tokens such as transferring assets, swapping, bridging, and rug checking.
2. NFT plugin (`@solana-agent-kit/plugin-nft`): NFT operations for Metaplex NFTs such as minting, listing, and metadata management.
3. DeFi plugin (`@solana-agent-kit/plugin-defi`): DeFi operations for Solana protocols such as staking, lending, borrowing, and spot and perpetual trading.
4. Misc plugin (`@solana-agent-kit/plugin-misc`): Miscellaneous operations such as airdrops, price feeds, coingecko token information, and domain registration.
5. Blinks plugin (`@solana-agent-kit/plugin-blinks`): Blinks operations for Solana protocols such as arcade games and more soon to come.
6. **Cypherpunk special**: Payments plugin (`@solana-agent-kit/plugin-payments`): Make x402-based payments between AI agents using Solana blockchain for protected API access and service payments.
7. **Cypherpunk special**: MCP Payments plugin (`examples/x402-payments-mcp`): Make x402-based payments using MCP with Claude Code or Codex AI agents using Solana blockchain.

## Quick Start

Initializing the wallet interface and agent with plugins:

```typescript
import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit"; // or import createLangchainTools if using langchain or createOpenAITools for OpenAI agents
import PaymentsPlugin from "@solana-agent-kit/plugin-token";

const keyPair = Keypair.fromSecretKey(bs58.decode("YOUR_SECRET_KEY"))
const wallet = new KeypairWallet(keyPair)

// Initialize with private key and optional RPC URL
const agent = new SolanaAgentKit(
  wallet,
  "YOUR_RPC_URL",
  {
    OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",
  }
) // Add the plugins you would like to use
  .use(PaymentsPlugin);

// Create LangChain tools
const tools = createVercelAITools(agent, agent.actions);
```

You can also make use of the wallet interface provided by the Solana wallet adapter for embedded wallets.

## Using the Payments Plugin for x402-based AI Agent Payments

The hackaroo-special `plugin-payments` enables x402-based payments between AI agents using the Solana blockchain. This allows agents to pay for protected API access and services automatically.

```typescript
import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments"; // Import the payments plugin

const keyPair = Keypair.fromSecretKey(bs58.decode("YOUR_SECRET_KEY"))
const wallet = new KeypairWallet(keyPair)

// Initialize with private key and optional RPC URL
const agent = new SolanaAgentKit(
  wallet,
  "YOUR_RPC_URL",
  {
    OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",
  }
) // Add the plugins you would like to use
  .use(TokenPlugin)
  .use(PaymentsPlugin); // Add the payments plugin

// Create tools for AI framework
const tools = createVercelAITools(agent, agent.actions);

// Make x402-protected requests - the agent will automatically pay when required
const result = await agent.methods.makeX402PaymentRequest(
  agent,
  "https://api.example.com",  // base URL
  "/protected-endpoint"       // endpoint path
);

console.log("Payment request result:", result);

// Or get payment info for a protected endpoint without executing the payment
const paymentInfo = await agent.methods.getX402PaymentInfo(
  agent,
  "https://api.example.com",  // base URL
  "/protected-endpoint"       // endpoint path
);

console.log("Payment info:", paymentInfo);
```

## **Cypherpink special Examples

### x402 Payments Example

Located in `examples/x402-payments`, this scriptable walkthrough spins up a payments-enabled agent, explains wallet setup, and showcases:

- Environment scaffolding via `.env` with `SOLANA_PRIVATE_KEY`, `RPC_URL`, and optional `OPENAI_API_KEY`.
- CLI run instructions (`pnpm install`, `pnpm build`, `pnpm tsx index.ts`) with narrative logging for each payment step.
- Live demonstrations of `makeX402PaymentRequest`, `getX402PaymentInfo`, and AI tool wiring through `createVercelAITools`.

### x402 Payments MCP Example

Found in `examples/x402-payments-mcp`, this project packages the payments plugin as a Claude-ready MCP server and covers:

- Configuration via `.env` plus Claude Desktop’s `claude_desktop_config.json` for local bindings.
- Build and dev entrypoints (`pnpm install`, `pnpm run build`, `pnpm run dev`) that expose all agent actions, including payments, over MCP.
- A turnkey test prompt for paying `https://x402.payai.network/api/solana-devnet/paid-content`, illustrating the full 402→payment→content loop once the wallet is funded.

## Dependencies

The toolkit relies on several key Solana and Metaplex libraries:

- @solana/web3.js
- @solana/spl-token
- @metaplex-foundation/digital-asset-standard-api
- @metaplex-foundation/mpl-token-metadata
- @metaplex-foundation/mpl-core
- @metaplex-foundation/umi
- @lightprotocol/compressed-token
- @lightprotocol/stateless.js
- @coingecko/sdk
- x402

## License

Apache-2 License

## Attributions

System prompt logic adapted from Coinbase AgentKit (Apache 2.0)
**Original Repository**: [https://github.com/sendaifun/solana-agent-kit](https://github.com/sendaifun/solana-agent-kit)
