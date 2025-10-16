<div align="center">

# x402 Payments for Solana Agent Kit

### AI Agents with Autonomous x402 Payment Capabilities

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

**Hackathon Submission:** Cypherpunk 2025 & Hackaroo 2025

</div>

----

## 🎯 The Innovation

We've extended the powerful Solana Agent Kit with **groundbreaking x402 payment capabilities** that enable AI agents to autonomously pay for protected API access using the Solana blockchain. This isn't just a proof-of-concept—it's a production-ready system with comprehensive testing, documentation, and real-world examples.

### Why This Matters

**The Problem:** AI agents can't autonomously access paid APIs and services. Current payment systems require human intervention, breaking agent autonomy and limiting real-world utility.

**Our Solution:** Complete x402 payment protocol integration with Solana, enabling AI agents to detect paywalls, execute blockchain transactions, and access paid content—fully autonomously, no human intervention required.

## ✨ Core Features & Technical Achievements

### 🤖 Production-Ready Payment Plugin (`@solana-agent-kit/plugin-payments`)
- **Fully Autonomous Payment Flow:** AI agents automatically detect HTTP 402 paywalls, execute Solana transactions, and retry with payment headers—zero human intervention
- **Smart Signer Caching:** Optimized transaction signing with intelligent caching for high-performance operations
- **Network Auto-Detection:** Seamlessly switches between mainnet and devnet based on RPC configuration
- **Framework Integration:** First-class `x402_payment_request` action integrates with Vercel AI SDK, LangChain, and OpenAI frameworks
- **Zero Glue Code:** Direct integration with AI frameworks via clean plugin architecture

### 🧪 Comprehensive Testing Infrastructure
- **End-to-End Test Suite:** Complete test coverage in `test/plugin-payment-tests/` with mocked RPC primitives, 402 challenges, and payment receipts
- **Regression-Proof:** Validates complete payment handshake from challenge to settlement confirmation
- **Real-World Scenarios:** Network detection, signer caching, error handling, and retry logic
- **Production-Grade:** Tests mirror actual Solana devnet/mainnet behavior

### 💻 Battle-Tested Examples

**CLI Payment Demo** (`examples/x402-payments`)
- Scriptable demonstration with step-by-step narrative logging
- Shows agents autonomously paying for protected content
- Complete environment setup and wallet configuration guide

**MCP Server** (`examples/x402-payments-mcp`)
- Full Model Context Protocol server for Claude Desktop integration
- Exposes entire payment surface to desktop AI assistants
- Turnkey deployment with minimal configuration

### 🏗️ Enterprise-Grade Infrastructure
- **Memory Optimization:** Solved OOM issues in constrained environments
- **Dual Module Support:** Clean ESM/CJS builds for maximum compatibility
- **Monorepo Integration:** Seamless turbo + pnpm pipeline integration
- **Comprehensive Documentation:** Complete payment flow guide in `docs/x402.md`

### 🌐 60+ Solana Operations Beyond Payments

The toolkit enables AI agents to autonomously perform:
- **x402 Payments** - Pay for protected API access automatically
- **Token Operations** - Deploy, transfer, swap, and bridge SPL tokens
- **NFT Management** - Create collections, mint NFTs, manage metadata
- **DeFi Integration** - Stake, lend, borrow, and trade on Jupiter, Raydium, Orca
- **Cross-Chain Bridging** - Move assets via Wormhole and deBridge
- **Solana Blinks** - Execute protocol-specific actions
- **Market Data** - Access real-time pricing via CoinGecko Pro API

----

## 🏆 Hackathon Submission

### Dual Submission Strategy

**[Cypherpunk 2025](https://www.colosseum.com/cypherpunk)** - Privacy & Cryptography Focus
- ✅ Self-sovereign agent wallets with cryptographic security
- ✅ Privacy-preserving payment protocol implementation
- ✅ No central authority for agent transactions
- ✅ Cypherpunk ethos: "Privacy is necessary for an open society in the electronic age"

**[Hackaroo 2025](https://www.hackaroo.xyz)** - Payments with Blockchain
- ✅ Novel x402 payment protocol integration with Solana
- ✅ AI agent autonomy with blockchain interaction
- ✅ Solana ecosystem advancement (Web3.js, transaction building, RPC)
- ✅ Real-world utility: Micropayments for AI-accessed content

### What Makes This Special

1. **Technical Depth:** Full-stack integration from AI framework to on-chain settlement
2. **Production Ready:** Comprehensive testing, error handling, and live demos
3. **Open Innovation:** Built on permissive licensing, extensible architecture
4. **Real Use Case:** Solves the AI micropayment problem with working implementation

### Why x402 + Solana Matters

The x402 protocol represents the future of micropayments and API monetization. By integrating it with AI agents on Solana, we're enabling:

- **Agent-to-Agent Commerce:** AI agents can autonomously purchase services from other agents
- **Instant Micropayments:** Solana's 400ms blocks and low fees make per-request payments viable
- **Self-Sovereign Agents:** Agents control their own wallets and make independent payment decisions
- **Protected API Monetization:** Service providers can easily paywall endpoints with x402

----

## 🛠️ Technology Stack

### AI Framework Integration
- **LangChain:** Ready-to-use tools via `createLangchainTools()`
- **Vercel AI SDK:** Framework-agnostic support via `createVercelAITools()`
- **OpenAI Agents:** Direct integration via `createOpenAITools()`
- **Model Context Protocol (MCP):** Desktop AI integration (Claude Desktop, Claude Code)
- **Custom Frameworks:** Extensible action system for any framework

### Plugin Architecture
Modular plugin system for maximum flexibility:

1. ⭐ **Payments Plugin** - x402 autonomous payment capabilities (Hackathon contribution)
2. **Token Plugin** - SPL token operations, swaps, bridging, rug checking
3. **NFT Plugin** - Metaplex NFT operations, 3.Land integration
4. **DeFi Plugin** - Jupiter, Raydium, Orca, Adrena, Drift protocols
5. **Misc Plugin** - Airdrops, price feeds, domain registration
6. **Blinks Plugin** - Solana Blinks protocol integration
7. **MCP Adapter** - Model Context Protocol adapter (Enhanced for payments)

### Blockchain Layer
- **@solana/web3.js:** Solana blockchain interaction primitives
- **@solana/spl-token:** SPL token operations
- **@metaplex-foundation/\*:** NFT and metadata operations
- **x402:** Payment protocol implementation
- **Custom RPC:** Flexible endpoint configuration

## 💡 x402 Payment Protocol - Technical Implementation

The toolkit implements the **HTTP 402 Payment Required** standard, enabling AI agents to autonomously access paid APIs and services. This is a **novel integration** for AI agent frameworks.

### Payment Flow Architecture

```
AI Agent → Function Call → HTTP 402 → Transaction Build → Sign & Submit → Retry with Proof → Content Delivery
```

### Step-by-Step Process

1. **🤖 Agent Encounters Paywall**
   ```typescript
   const result = await makeX402PaymentRequest(
     agent,
     "https://x402.payai.network",
     "/api/solana-devnet/paid-content"
   );
   ```

2. **📡 Initial Request**
   Agent makes request without payment credentials

3. **💳 402 Response**
   Server returns `402 Payment Required` with payment requirements:
   ```json
   {
     "amount": 1000000,
     "recipient": "7x4Qf...",
     "reference": "uuid",
     "network": "solana-devnet"
   }
   ```

4. **🔨 Transaction Construction**
   Agent builds Solana transaction with correct account ordering

5. **✍️ Signing & Submission**
   Agent signs transaction from its wallet and submits to blockchain

6. **🔄 Retry with Proof**
   Agent retries request with `X-PAYMENT` header containing transaction signature

7. **📦 Content Delivery**
   Server validates payment and returns protected content

### API Methods

**`makeX402PaymentRequest(agent, baseURL, endpoint)`**
- Fully autonomous payment flow
- Automatic retry with payment headers
- Returns content + payment receipt

**`getX402PaymentInfo(agent, baseURL, endpoint)`**
- Inspect payment requirements without paying
- Query existing payment status
- Perfect for cost estimation

### Key Implementation Features
- **Smart Signer Caching:** Optimized transaction signing
- **Network Auto-Detection:** Mainnet/devnet from RPC URL
- **Error Handling:** Graceful handling of payment failures
- **Receipt Generation:** Complete payment audit trail

### Network Support
- ✅ Solana Mainnet
- ✅ Solana Devnet

---

## 🎓 Technical Documentation & Resources

### Project Documentation
- **[docs/x402.md](docs/x402.md)** - Complete x402 payment flow guide
- **[AGENTS.md](AGENTS.md)** - Comprehensive project context for AI agents
- **[README.md](README.md)** - This file

### External Resources
- **[Original Toolkit](https://github.com/sendaifun/solana-agent-kit)** - Base Solana Agent Kit
- **[Solana Docs](https://docs.solana.com)** - Solana developer documentation
- **[x402 Protocol](https://github.com/coinbase/x402)** - Coinbase x402 specification
- **[Original Docs](https://docs.sendai.fun/v0/introduction)** - Full toolkit documentation


## 🏁 Quick Start

### Prerequisites
- **Node.js:** >= 22.0.0
- **pnpm:** >= 8.0.0
- **NPM 24+:** `npm install -g node-gyp` (if applicable)
- **Solana Wallet:** Private key for agent operations

### Installation

```bash
# Clone the repository
git clone https://github.com/quantaliz/solana-agent-kit
cd solana-agent-kit

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Memory Optimization
If you encounter OOM errors during build:
```bash
export NODE_OPTIONS="--max-old-space-size=6144"
pnpm build
```

### Try the x402 Payments Demo

```bash
# Build the payment examples
pnpm build:examples:payments
pnpm build:examples:payments-mcp

# Configure wallet
cd examples/x402-payments
cp .env.example .env
# Edit .env with your SOLANA_PRIVATE_KEY and RPC_URL

# Run CLI demo
pnpm start

# Or run MCP server
cd ../x402-payments-mcp
pnpm start
```

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

**Example:** Check **[SolAIBot](https://github.com/quantaliz/solaibot)**, an on-device Android LLM with Mobile Wallet Adapter integration, capable of autonomously paying x402 endpoints.

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

---

## 🏗️ Development Stats

| Metric | Value |
|--------|-------|
| **New Code** | 1,000+ lines for x402 integration |
| **Examples** | 2 complete x402 demos |

### Recent Milestones
- ✅ **x402 Plugin** - Full payment protocol implementation
- ✅ **MCP Server** - Desktop AI assistant integration
- ✅ **CLI Demo** - Interactive payment demonstration
- ✅ **Devnet Testing** - End-to-end validation
- ✅ **Production Tests** - Comprehensive test suite

---

## 🚀 Future Roadmap

### Post-Hackathon Features
- [ ] **Multi-Chain Support:** Extend x402 to EVM chains
- [ ] **Payment Streaming:** Subscription and streaming payment models
- [ ] **Advanced Caching:** Persistent payment receipt storage
- [ ] **Agent Marketplace:** Discovery platform for paid agent services
- [ ] **Analytics Dashboard:** Payment tracking and reporting
- [ ] **Mobile SDK:** Native mobile agent integration with [SolAIBot](https://github.com/quantaliz/solaibot)

---

## 🔍 What Makes This Special

### Production-Ready, Not a Proof-of-Concept
- **Comprehensive Testing:** Full test suite with mocked RPC calls and payment flows
- **Error Handling:** Graceful handling of payment failures, network issues, retries
- **Performance Optimized:** Signer caching, efficient transaction construction
- **Well Documented:** Complete API docs, usage guides, and code examples

### Real Innovation
- **First x402 + Solana Integration:** Pioneering autonomous agent payments on Solana
- **MCP Integration:** Bringing payments to desktop AI assistants (Claude Desktop, Claude Code)
- **Framework Agnostic:** Works with any AI framework via clean plugin architecture
- **Future-Proof:** Extensible design ready for multi-chain expansion

### Battle-Tested
- ✅ Live demo endpoint available at x402.payai.network
- ✅ Works with real Solana transactions on devnet/mainnet
- ✅ Production-grade error handling
- ✅ Comprehensive test coverage
- ✅ Multiple working examples

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

---

## 📦 Key Dependencies

### Blockchain Layer
- **@solana/web3.js** - Solana blockchain interaction
- **@solana/spl-token** - SPL token operations
- **@metaplex-foundation/\*** - NFT operations
- **@lightprotocol/\*** - Compressed tokens
- **x402** - Payment protocol implementation

### AI Framework Layer
- **ai** - Vercel AI SDK integration
- **@langchain/core** - LangChain integration
- **@openai/agents** - OpenAI agents support
- **@modelcontextprotocol/sdk** - MCP integration

---

## 👤 About Quantaliz

<div align="center">
<img src="../images/Quantaliz.png" width="200" alt="Quantaliz Logo" />
</div>

**[Quantaliz PTY LTD](https://www.quantaliz.com)** is pioneering the intersection of AI agents and decentralized technologies. We believe the future of AI is autonomous, self-sovereign, and economically integrated with Web3.

### Contact & Links
- **Website:** [quantaliz.com](https://www.quantaliz.com)
- **GitHub:** [github.com/quantaliz](https://github.com/quantaliz)
- **Related Project:** [SolAIBot](https://github.com/quantaliz/solaibot) - On-device AI with x402 payments

---

## 📄 License

Licensed under the **Apache License 2.0** - See [LICENSE](LICENSE) for details.

### Acknowledgments

- **Baseline Solana Agent Kit:** [sendaifun/solana-agent-kit](https://github.com/sendaifun/solana-agent-kit)
- **x402 Protocol:** Coinbase's HTTP 402 micropayment standard

---

<div align="center">

## 🚀 Give Your AI Agents Financial Autonomy

**Built for Cypherpunk 2025 & Hackaroo 2025**

*Demonstrating that AI agents can be self-sovereign and financially autonomous*

[![Star](https://img.shields.io/github/stars/quantaliz/solana-agent-kit?style=social)](https://github.com/quantaliz/solana-agent-kit)
[![Cypherpunk](https://img.shields.io/badge/Cypherpunk-2025-purple.svg)](https://www.colosseum.com/cypherpunk)
[![Hackaroo](https://img.shields.io/badge/Hackaroo-2025-orange.svg)](https://www.hackaroo.xyz)

⭐ Star this repo | 🔗 Try the examples | 💬 Join the discussion

</div>
