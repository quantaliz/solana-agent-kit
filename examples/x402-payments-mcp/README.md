# Solana Agent Kit MCP with Payments Example

This example demonstrates how to use the `@solana-agent-kit/adapter-mcp` with the `@solana-agent-kit/plugin-payments` to create an MCP (Model Context Protocol) server that enables AI assistants to perform x402 payments on the Solana blockchain.

## Prerequisites

- Node.js (v16 or higher recommended)
- pnpm (preferred), yarn, or npm
- Solana wallet with private key
- Solana RPC URL
- Claude Desktop (or another MCP-compatible AI assistant)

## Installation

1. Install dependencies at `solana-agent-kit/examples/x402-payments-mcp`:

```bash
pnpm install
```

## Configuration

1. Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

2. Edit the `.env` file and set your values:

```env
SOLANA_PRIVATE_KEY=your_private_key_here
RPC_URL=your_solana_rpc_url_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional but recommended
```

## Running the Example

1. Build the project:

```bash
pnpm run build
```

Or run directly with tsx:

```bash
pnpm run dev
```

## Configuring Claude Desktop

1. Change the Claude Desktop MCP server settings:

For MacOS:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

For Windows:
```bash
code $env:AppData\Claude\claude_desktop_config.json
```

2. Add the following configuration (replace the path with your absolute project path):

```json
{
    "mcpServers": {
        "solana-agent-payments": {
            "command": "node",
            "env": {
                "RPC_URL": "your_solana_rpc_url_here",
                "SOLANA_PRIVATE_KEY": "your_private_key_here",
                "OPENAI_API_KEY": "your_openai_api_key_here"
            },
            "args": [
                "/ABSOLUTE/PATH/TO/YOUR/PROJECT/dist/index.js" // e.g /Users/username/Projects/solana-agent-kit/examples/mcp-with-payments/dist/index.js
            ]
        }
    }
}
```

3. Restart Claude Desktop after updating the configuration.

## How It Works

- The example creates a Solana Agent Kit instance with the payments plugin
- It starts an MCP server that exposes x402 payment functionality to AI assistants
- When Claude Desktop (or another MCP-compatible assistant) connects, it will have access to the payment tools
- AI agents can then use these tools to make automated payments when accessing x402-protected APIs

## Key Features

- Full x402 payment protocol implementation
- MCP-compatible server for AI assistants
- Solana blockchain integration for secure payments
- Automatic payment handling for protected APIs

## Available Actions

The server exposes all Solana Agent Kit actions, including:
- Payment actions from the plugin-payments
- Token operations from the core agent
- NFT, DeFi, and other operations depending on which plugins are included

## Troubleshooting

- Ensure your wallet has sufficient SOL tokens for transaction fees
- Verify that your RPC URL is correct and accessible
- Check that your Claude Desktop configuration is properly formatted
- Make sure to restart Claude Desktop after configuration changes

## Test

You can test the payment with the following prompt:

```
Help me make a payment to https://x402.payai.network/api/solana-devnet/paid-content then tell me the results
```

When the wallet has at least 0.1 USDC in funds, it will make the payment, for which you should see something like this:

```
 I've successfully made the payment to the X402 payment endpoint. Here are the details of the transaction:

   - Transaction ID: ghySvV1afdme3eU5cbxbV64qpH8jsMSMQEs5h1Yn74NaLjzwGvsxPU51kawg4xqjzPETpz3vynBgJevvjSSdGw
   - Network: Solana Devnet
   - Payer: 7dRXJd2pmzpPzXx7Dxo1oapVGRF4jXsWeKRnmEKSfM7
   - Premium Content: "Have some rizz!"
   - Refund Transaction: 3SNAYwvIotARdJLmrQZP9maDzZTh5vczrmvKbeCZi2yMNyFTYENVY9Tx3TVPCmALZy1mTJ7FAgfrCZUemSSV

  The payment was successful and you've received access to the premium content.
  ```