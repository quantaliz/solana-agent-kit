<div align="center">

# Solana Agent Kit

### 🏆 Cypherpunk & Hackaroo Hackathon Edition 🏆

**Empowering AI Agents with Autonomous Payment Capabilities**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange.svg)](https://pnpm.io/)

**Original Repository**: [sendaifun/solana-agent-kit](https://github.com/sendaifun/solana-agent-kit)

</div>

----

## 🎯 What We Built for Cypherpunk & Hackaroo

We've taken the powerful Solana Agent Kit and added **groundbreaking x402 payment capabilities** that enable AI agents to autonomously pay for protected API access using Solana blockchain. This isn't just a proof-of-concept—it's a production-ready system with comprehensive testing, documentation, and real-world examples.

### 🚀 Key Achievements

#### 1️⃣ Production-Ready Payment Plugin (`@solana-agent-kit/plugin-payments`)
- **Autonomous Payment Flow**: AI agents automatically detect HTTP 402 paywalls, execute Solana transactions, and retry with payment headers—no human intervention required
- **Smart Signer Caching**: Optimized transaction signing with intelligent caching for high-performance operations
- **Network Auto-Detection**: Seamlessly switches between mainnet and devnet based on RPC configuration
- **Zero Glue Code**: First-class `x402_payment_request` action integrates directly with Vercel AI SDK, LangChain, and OpenAI frameworks

#### 2️⃣ Comprehensive Testing Infrastructure
- **End-to-End Test Suite** (`test/plugin-payment-tests/`): Mocks RPC primitives, 402 challenges, and payment receipts
- **Regression-Proof**: Validates complete payment handshake from challenge to confirmation
- **Real-World Scenarios**: Tests cover network detection, signer caching, error handling, and retry logic

#### 3️⃣ Battle-Tested Examples

**CLI Example** (`examples/x402-payments`):
- Scriptable demonstration with step-by-step narrative logging
- Shows agents autonomously paying for protected content
- Complete environment setup and wallet configuration guide

**MCP Server** (`examples/x402-payments-mcp`):
- Full Model Context Protocol server for Claude Desktop integration
- Exposes entire payment surface to desktop AI assistants
- Turnkey deployment with minimal configuration

#### 4️⃣ Enterprise-Grade Infrastructure
- **Memory Optimization**: Solved OOM issues in constrained environments
- **Dual Module Support**: Clean ESM/CJS builds for maximum compatibility
- **Monorepo Integration**: Seamless turbo + pnpm pipeline integration
- **Comprehensive Documentation**: `docs/x402.md` with complete payment flow guide

----

## 💡 Why This Matters

The x402 protocol represents the future of micropayments and API monetization. By integrating it with AI agents on Solana, we're enabling:

- **Agent-to-Agent Commerce**: AI agents can autonomously purchase services from other agents
- **Instant Micropayments**: Solana's speed and low fees make per-request payments viable
- **Self-Sovereign Agents**: Agents control their own wallets and make independent payment decisions
- **Protected API Monetization**: Service providers can easily paywall endpoints with x402

## 🌟 Beyond Payments: 60+ Solana Operations

This toolkit enables AI agents to autonomously perform:

- **x402 Payments** - Pay for protected API access automatically
- **Token Operations** - Deploy, transfer, swap, and bridge SPL tokens
- **NFT Management** - Create collections, mint NFTs, manage metadata
- **DeFi Integration** - Stake, lend, borrow, and trade on Jupiter, Raydium, Orca
- **Cross-Chain Bridging** - Move assets via Wormhole and deBridge
- **Solana Blinks** - Execute protocol-specific actions
- **Market Data** - Access real-time pricing via CoinGecko Pro API


## 🔧 Technical Architecture

### Plugin System
The toolkit uses a modular plugin architecture for maximum flexibility:

1. **Token Plugin** - SPL token operations, swaps, bridging, rug checking
2. **NFT Plugin** - Metaplex NFT operations, 3.Land integration
3. **DeFi Plugin** - Jupiter, Raydium, Orca, Adrena, Drift protocols
4. **Misc Plugin** - Airdrops, price feeds, domain registration
5. **Blinks Plugin** - Solana Blinks protocol integration
6. **Payments Plugin** ⭐ - x402 payment capabilities (Cypherpunk contribution)

### MCP Adapter
Full Model Context Protocol support for seamless integration with:
- Claude Desktop
- Claude Code
- Any MCP-compatible AI system

## 🤖 AI Framework Integration

Works seamlessly with all major AI frameworks:

- **LangChain** - Ready-to-use tools via `createLangchainTools()`
- **Vercel AI SDK** - Framework-agnostic support via `createVercelAITools()`
- **OpenAI Agents** - Direct integration via `createOpenAITools()`
- **Model Context Protocol** - Desktop AI integration via MCP server
- **Custom Frameworks** - Extensible action system for any framework

## 💳 x402 Payments Deep Dive

### How It Works

```typescript
// 1. Agent encounters a 402 paywall
const result = await makeX402PaymentRequest(
  agent,
  "https://x402.payai.network",
  "/api/solana-devnet/paid-content"
);

// Behind the scenes:
// ✅ Agent detects HTTP 402 challenge
// ✅ Parses payment requirements (price, network, recipient)
// ✅ Creates Solana transaction from agent's wallet
// ✅ Signs and submits transaction to blockchain
// ✅ Generates x402 payment header with proof
// ✅ Retries request with payment header
// ✅ Returns protected content to agent
```

### API Methods

**`makeX402PaymentRequest(agent, baseURL, endpoint)`**
- Fully autonomous payment flow
- Automatic retry with payment headers
- Returns content + payment receipt

**`getX402PaymentInfo(agent, baseURL, endpoint)`**
- Inspect payment requirements without paying
- Query existing payment status
- Perfect for displaying pricing to users

### Network Support
- ✅ Solana Mainnet
- ✅ Solana Devnet

## 📚 Documentation

- **x402 Payments Guide**: [`docs/x402.md`](docs/x402.md) - Complete guide to payment flows
- **Original Docs**: [docs.sendai.fun](https://docs.sendai.fun/v0/introduction) - Full toolkit documentation
- **AGENTS.md**: [`AGENTS.md`](AGENTS.md) - Comprehensive project context for AI agents

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/quantaliz/solana-agent-kit
cd solana-agent-kit

# Install dependencies (Node 22+ required)
pnpm install

# Build all packages
pnpm build
```

### Try the x402 Payments Demo

```bash
# Build the payment examples
pnpm build:examples:payments
pnpm build:examples:payments-mcp

# Run the MCP server (requires wallet setup)
pnpm run:examples:payments-mcp
```

### Memory Optimization
If you encounter OOM errors during build:
```bash
export NODE_OPTIONS="--max-old-space-size=6144"
pnpm build
```

### Prerequisites
- Node.js >= 22.0.0
- pnpm >= 8.0.0
- For NPM 24+: `npm install -g node-gyp`

## 📦 Available Plugins

Choose the plugins you need for your AI agent:

| Plugin | Description | Hackathon Features |
|--------|-------------|-------------------|
| `@solana-agent-kit/plugin-payments` | **x402 autonomous payments** | ⭐ **Yes** |
| `@solana-agent-kit/examples/x402-payments-mcp` | **x402 MCP service** | ⭐ **Yes** |
| `@solana-agent-kit/plugin-token` | SPL token operations, swaps, bridging, rug checking | |
| `@solana-agent-kit/plugin-nft` | Metaplex NFT operations, minting, listing, metadata | |
| `@solana-agent-kit/plugin-defi` | Staking, lending, borrowing, perpetual trading | |
| `@solana-agent-kit/plugin-misc` | Airdrops, price feeds, domain registration | |
| `@solana-agent-kit/plugin-blinks` | Solana Blinks protocol integration | |
| `@solana-agent-kit/adapter-mcp` | Model Context Protocol adapter | Enhanced |

## 💻 Code Examples

### Basic Agent Setup

```typescript
import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Initialize wallet
const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY));
const wallet = new KeypairWallet(keyPair);

// Create agent with plugins
const agent = new SolanaAgentKit(
  wallet,
  process.env.RPC_URL,
  {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }
)
  .use(TokenPlugin)
  .use(PaymentsPlugin);  // Add payment capabilities

// Create AI framework tools
const tools = createVercelAITools(agent, agent.actions);
```

### Agent with Embedded Wallet Support

You can also use wallet interfaces from Solana wallet adapters for embedded wallet integration (Privy, Crossmint, Phantom, etc.).

Check **[SolAIBot](https://github.com/quantaliz/solaibot)**, an on-device LLM capable of paying x402 endpoints.

### x402 Payment Flow

```typescript
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import PaymentsPlugin, { makeX402PaymentRequest, getX402PaymentInfo } from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Setup agent with payment capabilities
const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY));
const wallet = new KeypairWallet(keyPair);

const agent = new SolanaAgentKit(wallet, process.env.RPC_URL, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}).use(PaymentsPlugin);

// Make autonomous payment for protected content
const result = await makeX402PaymentRequest(
  agent,
  "https://x402.payai.network",
  "/api/solana-devnet/paid-content"
);

console.log("Status:", result.status);           // 200 (success)
console.log("Content:", result.data);            // Protected content
console.log("Payment:", result.paymentInfo);     // Transaction details

// Or inspect payment requirements first
const paymentInfo = await getX402PaymentInfo(
  agent,
  "https://x402.payai.network",
  "/api/solana-devnet/paid-content"
);

console.log("Price:", paymentInfo.challenge.requirement.maxPrice);
console.log("Network:", paymentInfo.challenge.requirement.network);
console.log("Recipient:", paymentInfo.challenge.requirement.recipient);
```

## 🎬 Live Examples

### 1. CLI Payment Demo (`examples/x402-payments`)

Interactive command-line demonstration showing:
- ✅ Autonomous agent payment flows
- ✅ Step-by-step narrative logging
- ✅ Environment setup guide
- ✅ Wallet configuration walkthrough
- ✅ Real-time payment execution

**Run it:**
```bash
cd examples/x402-payments
cp .env.example .env
# Edit .env with your keys
pnpm install
pnpm start
```

### 2. MCP Server Demo (`examples/x402-payments-mcp`)

Full Model Context Protocol server for Claude Desktop:
- ✅ Complete agent action surface exposed via MCP
- ✅ Claude Desktop integration
- ✅ Zero-config payment capabilities
- ✅ Test against live x402 endpoints

**Run it:**
```bash
cd examples/x402-payments-mcp
cp .env.example .env
# Edit .env with your keys
pnpm install
pnpm run build
pnpm start
```

**Test prompt for Claude Desktop:**
```
Make a payment to https://x402.payai.network/api/solana-devnet/paid-content
```

## 🔍 What Makes This Special

### Production-Ready, Not a Toy
- **Comprehensive Testing**: Full test suite with mocked RPC calls and payment flows
- **Error Handling**: Graceful handling of payment failures, network issues, retries
- **Performance Optimized**: Signer caching, efficient transaction construction
- **Well Documented**: Complete API docs, usage guides, and code examples

### Real Innovation
- **First x402 + Solana Integration**: Pioneering autonomous agent payments on Solana
- **MCP Integration**: Bringing payments to desktop AI assistants
- **Framework Agnostic**: Works with any AI framework via clean plugin architecture
- **Future-Proof**: Extensible design ready for multi-chain expansion

### Battle-Tested
- ✅ Live demo endpoint available
- ✅ Works with real Solana transactions
- ✅ Handles mainnet and devnet
- ✅ Production-grade error handling
- ✅ Comprehensive test coverage

## 🧪 Testing

Run the comprehensive test suite:

```bash
# All tests
pnpm test

# Payment plugin tests only
pnpm test:payments
```

Tests cover:
- x402 challenge parsing
- Solana transaction construction
- Payment header generation
- Network detection (mainnet/devnet)
- Signer caching
- Error scenarios and retries

## 📦 Key Dependencies

**Blockchain:**
- `@solana/web3.js` - Solana blockchain interaction
- `@solana/spl-token` - SPL token operations
- `@metaplex-foundation/*` - NFT operations
- `@lightprotocol/*` - Compressed tokens
- `x402` - Payment protocol implementation

**AI Frameworks:**
- `ai` - Vercel AI SDK integration
- `@langchain/core` - LangChain integration
- `@openai/agents` - OpenAI agents support
- `@modelcontextprotocol/sdk` - MCP integration

## 📄 License

Apache-2.0 License

## 🙏 Acknowledgments

- **Original Solana Agent Kit**: [sendaifun/solana-agent-kit](https://github.com/sendaifun/solana-agent-kit)
- **x402 Protocol**: Coinbase's HTTP 402 micropayment standard
- **System Prompt Logic**: Adapted from Coinbase AgentKit (Apache 2.0)

## 🎯 Built for Cypherpunk & Hackaroo Hackathons

This project represents significant engineering effort to bring autonomous payment capabilities to AI agents:

- **2,000+ lines of new code** across plugin, tests, and examples
- **Production-ready infrastructure** with comprehensive testing
- **Full documentation** including guides, API docs, and examples
- **Real-world integration** with live x402 endpoints
- **MCP server** for desktop AI integration

We're not just showing what's possible—we've built something that works today and is ready for production use.

---

## 👤 Developer
![Quantaliz](../images/Quantaliz.png)

*Developed by [Quantaliz](https://www.quantaliz.com) - Bringing AI and Web3 together*

---

<div align="center">

**¿Are Ready to give your AI agents financial autonomy?**

⭐ Star this repo | 🔗 Check the examples | 💬 Join the discussion

</div>
