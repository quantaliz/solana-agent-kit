# Solana Agent Kit - Project Context

## Project Overview

Solana Agent Kit is an open-source TypeScript toolkit for connecting AI agents to Solana protocols. It enables AI agents to autonomously perform over 60 Solana blockchain operations including token trading, NFT creation, DeFi interactions, cross-chain bridging, AI agent payments via x402 protocol, and more. The project is built as a monorepo with a core package and multiple plugins that provide functionality in different domains like tokens, NFTs, DeFi, payments, and miscellaneous operations.

The architecture follows a plugin-based system where the core provides the foundation and plugins add specific functionality. This makes it modular, extensible, and suitable for production use cases. The toolkit integrates with major AI frameworks including LangChain, Vercel AI SDK, OpenAI agents, and Model Context Protocol (MCP).

**Note**: This is a fork of the original repository (https://github.com/sendaifun/solana-agent-kit) created for the Cypherpunk hackathon, with major enhancements to the payment capabilities and MCP integration.

## Architecture

The project follows a monorepo architecture using pnpm workspaces and Turbo for task management. Key components include:

- **Core Package** (`packages/core`): Contains the main `SolanaAgentKit` class, wallet interfaces (including `KeypairWallet`), types, and integration tools for different AI frameworks
- **Plugin System**: Modular plugins for different functionality areas:
  - `@solana-agent-kit/plugin-token`: Token operations (SPL tokens, transfers, swaps, bridging)
  - `@solana-agent-kit/plugin-nft`: NFT operations (Metaplex NFTs, minting, listing)
  - `@solana-agent-kit/plugin-defi`: DeFi operations (staking, lending, borrowing, trading)
  - `@solana-agent-kit/plugin-misc`: Miscellaneous operations (airdrops, price feeds, domain registration)
  - `@solana-agent-kit/plugin-blinks`: Solana Blinks operations
  - `@solana-agent-kit/plugin-payments`: **[Cypherpunk Hackathon Contribution]** x402 payment functionality for AI agents to autonomously pay for protected API access
  - `@solana-agent-kit/adapter-mcp`: Model Context Protocol adapter for integration with Claude Desktop and other MCP-compatible AI systems
- **Example Projects**: Demonstrations and starter templates:
  - `examples/x402-payments`: **[Cypherpunk Hackathon Contribution]** CLI example demonstrating x402 payment flows with scriptable walkthroughs
  - `examples/x402-payments-mcp`: **[Cypherpunk Hackathon Contribution]** MCP server implementation for x402 payments with Claude Desktop integration

## Building and Running

### Prerequisites
- Node.js >= 22.0.0
- pnpm >= 8.0.0

### Installation
```bash
pnpm install
```

### Building
```bash
# Build all packages
pnpm run build

# Build specific packages
pnpm run build:core
pnpm run build:plugin-token
pnpm run build:plugin-nft
pnpm run build:plugin-defi
pnpm run build:plugin-misc
pnpm run build:plugin-blinks
pnpm run build:plugin-payments
pnpm run build:adapter-mcp

# Build example projects
pnpm build:examples:payments
pnpm build:examples:payments-mcp
```

### Testing
```bash
# Run all tests
pnpm run test

# Run payment plugin tests specifically
pnpm run test:payments
```

### Running Examples
```bash
# Run the x402 payments MCP server
pnpm run:examples:payments-mcp
```

### Memory Optimization
If you encounter "Out-of-Memory" errors during compilation:
```bash
export NODE_OPTIONS="--max-old-space-size=6144"
pnpm build
```

### Development Commands
```bash
# Linting
pnpm run lint

# Linting with auto-fix
pnpm run lint:fix

# Formatting
pnpm run format

# Generate documentation
pnpm run docs
```

## Core Usage Example

```typescript
import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import NFTPlugin from "@solana-agent-kit/plugin-nft";
import DefiPlugin from "@solana-agent-kit/plugin-defi";
import MiscPlugin from "@solana-agent-kit/plugin-misc";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks";
import PaymentsPlugin from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const keyPair = Keypair.fromSecretKey(bs58.decode("YOUR_SECRET_KEY"));
const wallet = new KeypairWallet(keyPair);

// Initialize with private key and optional RPC URL
const agent = new SolanaAgentKit(
  wallet,
  "YOUR_RPC_URL",
  {
    OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",
  }
) // Add the plugins you would like to use
  .use(TokenPlugin)
  .use(NFTPlugin)
  .use(DefiPlugin)
  .use(MiscPlugin)
  .use(BlinksPlugin)
  .use(PaymentsPlugin);

// Create tools for AI frameworks
const tools = createVercelAITools(agent, agent.actions);
```

## x402 Payments Usage Example (Cypherpunk Hackathon Feature)

```typescript
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import PaymentsPlugin, { makeX402PaymentRequest, getX402PaymentInfo } from "@solana-agent-kit/plugin-payments";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const keyPair = Keypair.fromSecretKey(bs58.decode("YOUR_SECRET_KEY"));
const wallet = new KeypairWallet(keyPair);

const agent = new SolanaAgentKit(wallet, "YOUR_RPC_URL", {
  OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",
}).use(PaymentsPlugin);

// Make x402-protected requests - agent automatically pays when required
const result = await makeX402PaymentRequest(
  agent,
  "https://x402.payai.network",
  "/api/solana-devnet/paid-content"
);

console.log(result.status); // Final HTTP status
console.log(result.data); // Protected content
console.log(result.paymentInfo); // Payment receipt details

// Or inspect payment requirements without paying
const paymentInfo = await getX402PaymentInfo(
  agent,
  "https://x402.payai.network",
  "/api/solana-devnet/paid-content"
);

console.log(paymentInfo.challenge); // Price, network, recipient details
console.log(paymentInfo.paymentResponse); // Previous payment receipt if exists
```

## Development Conventions

### Code Style
- TypeScript is used throughout the project
- Code formatting follows Biome.js configuration (2-space indentation, 80-line width)
- ESLint is used for linting with specific rules for complexity, correctness, style, and suspicious patterns
- Follows existing codebase formatting and naming conventions
- Use camelCase for variables and functions, PascalCase for classes and types, UPPER_SNAKE_CASE for constants

### Commit Messages
- Follow Conventional Commits specification
- Examples: `feat: add ability to deploy new SPL token`, `fix: handle edge case when deploying collection`, `docs: update README with new usage examples`

### Plugin Architecture
- Plugins implement the `Plugin` interface with methods and actions
- Methods provide the actual implementation for blockchain operations
- Actions define the interface that AI agents can use
- The `use()` method adds plugins to the agent instance
- Methods are available under the `agent.methods` namespace with full type safety

### Security Practices
- Never commit `.env` files or sensitive data
- Private keys are handled securely through wallet interfaces
- The toolkit supports various wallet providers for signing transactions
- Always use environment variables for API keys and sensitive information

## Key Features

### Blockchain Operations
- **Token Operations**: Deploy SPL tokens, transfer assets, swap tokens, check balances, stake SOL
- **NFTs**: Create collections, mint NFTs, manage metadata and royalties via Metaplex
- **DeFi Integration**: Jupiter swaps, Raydium pools, Orca integration, perpetual trading with Adrena and Drift protocols
- **Cross-chain Bridging**: Support for Wormhole and deBridge protocols
- **Solana Blinks**: Integration with various protocol blinks
- **Market Data**: CoinGecko Pro API integration for real-time data
- **x402 Payments** **[Cypherpunk Hackathon]**: Autonomous AI agent payments for protected API access using Solana blockchain

### AI Integration
- **LangChain Integration**: Ready-to-use tools for blockchain operations
- **Vercel AI SDK Integration**: Framework agnostic support
- **OpenAI Agent Tools**: Integration with OpenAI functions
- **Model Context Protocol (MCP)**: Integration with Claude Desktop and MCP-compatible AI systems
- **Custom Tool Creation**: Create custom tools for specific blockchain operations

### Cypherpunk Hackathon Contributions

#### x402 Payment Plugin (`@solana-agent-kit/plugin-payments`)
Production-ready x402 payment pipeline that enables AI agents to autonomously pay for protected API access:

- **Core Features**:
  - Automatic HTTP 402 challenge handling and payment retry logic
  - Signer caching for optimized transaction performance
  - Network auto-detection (mainnet/devnet) based on RPC endpoint
  - Full x402 protocol compliance with payment header generation

- **API Methods**:
  - `makeX402PaymentRequest(agent, baseURL, endpointPath)`: Automatically handles 402 challenges, pays, and retries requests
  - `getX402PaymentInfo(agent, baseURL, endpointPath)`: Inspects payment requirements without executing payment

- **AI Framework Integration**:
  - First-class `x402_payment_request` action for AI tool wiring
  - Compatible with Vercel AI SDK, LangChain, and OpenAI agents
  - Zero glue code required for integration

- **Testing**:
  - End-to-end mocks and integration tests in `test/plugin-payment-tests/payments.ts`
  - Simulates RPC primitives, 402 challenges, and payment receipts
  - Validates payment flow correctness and retry logic

#### x402 Example Projects

**CLI Example** (`examples/x402-payments`):
- Scriptable walkthrough with narrative logging
- Environment scaffolding (`.env` configuration)
- CLI run instructions: `pnpm install`, `pnpm build`, `pnpm tsx index.ts`
- Live demonstrations of payment methods and AI tool integration

**MCP Server Example** (`examples/x402-payments-mcp`):
- Claude Desktop-ready MCP server implementation
- Configuration via `.env` and `claude_desktop_config.json`
- Exposes full agent action surface including payments over MCP
- Turnkey test prompt for `https://x402.payai.network/api/solana-devnet/paid-content`
- Build commands: `pnpm install`, `pnpm run build`, `pnpm run dev`

#### Technical Improvements
- **Packaging**: Updated build targets, TypeScript configs for ESM/CJS compatibility
- **CI/CD**: Hardened dependency hygiene and build pipeline
- **Memory Optimization**: Resolved OOM issues in constrained environments
- **Documentation**: Added `docs/x402.md` with comprehensive payment flow guide

## Project Structure
```
/solana-agent-kit
├── packages/                           # Monorepo packages
│   ├── core/                          # Core agent functionality (SolanaAgentKit, KeypairWallet)
│   ├── plugin-token/                  # Token operations
│   ├── plugin-nft/                    # NFT operations
│   ├── plugin-defi/                   # DeFi operations
│   ├── plugin-misc/                   # Miscellaneous operations
│   ├── plugin-blinks/                 # Solana Blinks
│   ├── plugin-payments/               # [Cypherpunk] x402 payment functionality
│   └── adapter-mcp/                   # Model Context Protocol adapter
├── examples/                          # Example implementations
│   ├── x402-payments/                 # [Cypherpunk] CLI payment example
│   ├── x402-payments-mcp/             # [Cypherpunk] MCP server payment example
│   ├── defi/                          # DeFi examples (market-making, DEX, wormhole)
│   ├── embedded-wallets/              # Wallet integration examples (Privy, Crossmint, etc.)
│   ├── social/                        # Social bot examples (Telegram, Discord)
│   └── misc/                          # Miscellaneous examples
├── test/                              # Test files
│   ├── plugin-payment-tests/          # [Cypherpunk] Payment plugin tests
│   │   ├── index.ts                   # Test runner
│   │   └── payments.ts                # Payment flow integration tests
│   └── ...                            # Other test files
├── docs/                              # Documentation
│   ├── x402.md                        # [Cypherpunk] x402 payments guide
│   └── ...                            # Auto-generated API docs
├── package.json                       # Root package configuration (v2.0.7)
├── pnpm-workspace.yaml                # Workspace configuration
├── tsconfig.json                      # TypeScript configuration
├── turbo.json                         # Turbo build system configuration
├── biome.json                         # Biome code formatting/linting configuration
├── AGENTS.md                          # This file - project context for AI agents
└── README.md                          # Main project documentation
```

## Contributing Guidelines

The project welcomes contributions. Key points:
- Follow the existing code style and conventions
- Use the plugin architecture for adding new functionality
- Write tests for new features (see `test/plugin-payment-tests/` for example)
- Update documentation as needed (including this AGENTS.md file)
- Use proper commit messages following conventional commits
- Ensure all checks pass before submitting a PR (`pnpm lint`, `pnpm test`, `pnpm build`)
- Check existing issues before creating new ones
- For security vulnerabilities, contact the maintainers directly

## Important Notes for AI Agents

### Current Repository Status
- **Version**: 2.0.7
- **Branch**: v2 (main development branch)
- **Fork**: This is a fork created for the Cypherpunk hackathon
- **Original Repo**: https://github.com/sendaifun/solana-agent-kit
- **Package Manager**: pnpm 9.15.3
- **Node Version**: >= 22.0.0

### Recent Major Changes (Cypherpunk Hackathon)
1. **Added `@solana-agent-kit/plugin-payments`**: Full x402 payment support for AI agents
2. **Added `examples/x402-payments`**: CLI demonstration of payment flows
3. **Added `examples/x402-payments-mcp`**: MCP server for Claude Desktop integration
4. **Added `test/plugin-payment-tests/`**: Comprehensive payment plugin tests
5. **Added `docs/x402.md`**: Complete x402 payment guide
6. **Updated build configuration**: ESM/CJS compatibility, memory optimization
7. **Updated package.json scripts**: Added payment-specific build and test commands

### Key Dependencies for x402 Payments
- `x402`: ^0.6.1 (x402 protocol implementation)
- `@solana/web3.js`: ^1.98.2 (Solana blockchain interaction)
- `@solana/signers`: ^2.3.0 (Transaction signing)
- `@solana/spl-token`: ^0.4.13 (SPL token operations)
- `@modelcontextprotocol/sdk`: ^1.7.0 (MCP integration)
- `bs58`: ^6.0.0 (Base58 encoding/decoding)
- `tweetnacl`: ^1.0.3 (Cryptographic operations)

### Working with x402 Payments
- Requires `KeypairWallet` for signing (browser/custodial wallets not yet supported)
- Auto-detects network (mainnet/solana-devnet) from RPC endpoint
- Handles HTTP 402 challenges automatically
- Caches signers for performance
- Test endpoint: `https://x402.payai.network/api/solana-devnet/paid-content`

### Build Considerations
- May require `NODE_OPTIONS="--max-old-space-size=6144"` for memory-constrained environments
- Use `turbo` for efficient monorepo builds
- TypeScript configs support both ESM and CJS outputs
- Biome.js handles formatting/linting (2-space indentation, 80-line width)