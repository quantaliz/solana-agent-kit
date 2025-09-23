import type { Plugin, SolanaAgentKit } from "solana-agent-kit";

// Import actions
import examplePaymentAction from "./actions/examplePayment";

// Import tools
import { examplePaymentMethod } from "./tools/examplePayment";

// Define and export the plugin
const PaymentsPlugin = {
  name: "payments",

  // Combine all tools
  methods: {
    examplePaymentMethod,
  },

  // Combine all actions
  actions: [
    examplePaymentAction,
  ],

  // Initialize function
  initialize: function (): void {
    // Initialize all methods with the agent instance
    for (const [methodName, method] of Object.entries(this.methods)) {
      if (typeof method === "function") {
        this.methods[methodName] = method;
      }
    }
  },
} satisfies Plugin;

// Default export for convenience
export default PaymentsPlugin;

// Named exports for direct access
export { examplePaymentMethod } from "./tools/examplePayment";
export { examplePaymentAction } from "./actions/examplePayment";