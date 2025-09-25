# Solana Agent Kit - Project Context

## Project Overview

Solana Agent Kit is an open-source TypeScript toolkit for connecting AI agents to Solana protocols. It enables AI agents to autonomously perform over 60 Solana blockchain operations including token trading, NFT creation, DeFi interactions, cross-chain bridging, and more. The project is built as a monorepo with a core package and multiple plugins that provide functionality in different domains like tokens, NFTs, DeFi, and miscellaneous operations.

The architecture follows a plugin-based system where the core provides the foundation and plugins add specific functionality. This makes it modular, extensible, and suitable for production use cases. The toolkit integrates with major AI frameworks including LangChain, Vercel AI SDK, and OpenAI agents.

## Architecture

The project follows a monorepo architecture using pnpm workspaces and Turbo for task management. Key components include:

- **Core Package** (`packages/core`): Contains the main `SolanaAgentKit` class, wallet interfaces, types, and integration tools for different AI frameworks
- **Plugin System**: Modular plugins for different functionality areas:
  - `@solana-agent-kit/plugin-token`: Token operations (SPL tokens, transfers, swaps, bridging)
  - `@solana-agent-kit/plugin-nft`: NFT operations (Metaplex NFTs, minting, listing)
  - `@solana-agent-kit/plugin-defi`: DeFi operations (staking, lending, borrowing, trading)
  - `@solana-agent-kit/plugin-misc`: Miscellaneous operations (airdrops, price feeds, domain registration)
  - `@solana-agent-kit/plugin-blinks`: Solana Blinks operations
  - `@solana-agent-kit/plugin-payments`: Payment functionality
  - `@solana-agent-kit/adapter-mcp`: Multi-chain protocol adapter

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
```

### Testing
```bash
pnpm run test
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
  .use(BlinksPlugin);

// Create tools for AI frameworks
const tools = createVercelAITools(agent, agent.actions);
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

### AI Integration
- **LangChain Integration**: Ready-to-use tools for blockchain operations
- **Vercel AI SDK Integration**: Framework agnostic support
- **OpenAI Agent Tools**: Integration with OpenAI functions
- **Custom Tool Creation**: Create custom tools for specific blockchain operations

## Project Structure
```
/proj
├── packages/                 # Monorepo packages
│   ├── core/                # Core agent functionality
│   ├── plugin-token/        # Token operations
│   ├── plugin-nft/          # NFT operations
│   ├── plugin-defi/         # DeFi operations
│   ├── plugin-misc/         # Miscellaneous operations
│   ├── plugin-blinks/       # Solana Blinks
│   ├── plugin-payments/     # Payment functionality
│   └── adapter-mcp/         # Multi-chain protocol adapter
├── examples/                # Example implementations
├── test/                    # Test files
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # Workspace configuration
├── tsconfig.json           # TypeScript configuration
├── turbo.json              # Turbo build system configuration
├── biome.json              # Biome code formatting/linting configuration
└── README.md               # Main project documentation
```

## Contributing Guidelines

The project welcomes contributions. Key points:
- Follow the existing code style and conventions
- Use the plugin architecture for adding new functionality
- Write tests for new features
- Update documentation as needed
- Use proper commit messages following conventional commits
- Ensure all checks pass before submitting a PR
- Check existing issues before creating new ones
- For security vulnerabilities, contact the maintainers directly