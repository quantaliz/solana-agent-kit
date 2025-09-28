# X402 Payment Example

This example demonstrates how to use the X402 payment functionality in the Solana Agent Kit. The X402 protocol enables automated payments between AI agents using the Solana blockchain for APIs that require payment.

## Overview

The X402 Payment Plugin allows AI agents to automatically pay for access to protected resources on the internet. This example shows:

- How to initialize the Solana Agent Kit with the payments plugin
- How to make X402-protected API requests that automatically handle payments
- How to retrieve payment information without making a payment
- How to integrate payment functionality with AI agents

## Prerequisites

Before running this example, ensure you have:

1. **Node.js** (v22 or higher)
2. **pnpm** (v8 or higher) 
3. A Solana wallet with sufficient SOL/Token balance for payments
4. (Optional) An OpenAI API key for AI integration

## Environment Setup

Create a `.env` file in the project root with the following variables:

```bash
# Solana wallet private key (base58 encoded)
SOLANA_PRIVATE_KEY="your-private-key-here"

# Solana RPC endpoint (defaults to devnet if not provided)
RPC_URL="https://api.devnet.solana.com"

# OpenAI API key (optional, for AI integration)
OPENAI_API_KEY="your-openai-api-key"
```

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the project:
   ```bash
   pnpm build
   ```

## Running the Example

Execute the example with:

```bash
pnpm tsx examples/x402-payments/index.ts
```

## Key Functions Explained

### 1. `makeX402PaymentRequest(agent, baseURL, endpointPath)`

This function makes HTTP requests to X402-protected endpoints and automatically handles the payment process:

- **Purpose**: Makes an HTTP request to a resource that requires X402 payment
- **How it works**: 
  - If the server returns HTTP 402, it parses the payment requirements
  - Automatically creates and signs the required payment transaction
  - Retries the request with the payment header
- **Returns**: The response data along with payment information

### 2. `getX402PaymentInfo(agent, baseURL, endpointPath)`

This function retrieves payment metadata without executing a payment:

- **Purpose**: Get information about payment requirements without paying
- **How it works**:
  - Makes a HEAD request to check for existing payment headers
  - If no payment header exists, makes a GET request to get the payment challenge
  - Parses the X402 challenge payload to extract requirements
- **Returns**: Payment challenge information or existing payment response

### 3. AI Integration

The example demonstrates how to integrate X402 payments with AI agents:

- **`createVercelAITools`**: Creates tools that AI frameworks can use
- **`x402_payment_request`**: AI agents can use this tool to make protected API calls
- **Automatic payment handling**: AI agents can automatically pay for resources

## How X402 Works

The X402 protocol is an HTTP-based payment protocol that works as follows:

1. **Initial Request**: Client makes a request to a protected resource
2. **402 Response**: Server responds with HTTP 402 and payment requirements
3. **Payment Creation**: Client creates a payment transaction based on requirements
4. **Retry Request**: Client retries with a payment header containing the transaction
5. **Access Granted**: Server validates payment and grants access

## Use Cases

This plugin enables several powerful use cases:

- **API Monetization**: AI agents can automatically pay for API access
- **Content Access**: Agents can pay for premium content
- **Service Access**: Access to specialized services that require payment
- **Data Monetization**: Automated payments for data access

## Important Notes

- **Funding**: Ensure your wallet has sufficient SOL/Token balance for payments
- **Test Environment**: The example uses mock endpoints; in production, use real X402-enabled services
- **Security**: Never commit private keys to version control
- **Costs**: All payments are real transactions on the Solana blockchain

## Example Output

When running the example, you'll see:

```
🚀 Starting X402 Payment Example...

✅ Wallet created
✅ Solana Agent Kit initialized with Payments Plugin

📋 Example: Making an X402 Payment Request
✅ X402 Payment Request Successful!
   Status: 200
   Data received: {"paid": true}
   Payment info: {"success": true, ...}

📋 Example: Getting X402 Payment Information
✅ X402 Payment Info Retrieved!
   Challenge: {"requirement": {...}, "version": 1}

🎉 X402 Payment Example Completed!
```

## Troubleshooting

- **Module Resolution Errors**: Run `pnpm build` before running the example
- **Wallet Issues**: Ensure your private key is properly formatted and funded
- **Network Issues**: Verify your RPC URL and network connectivity
- **Payment Failures**: Check wallet balance and token compatibility