// Import tools
import { makeX402PaymentRequest, getX402PaymentInfo } from "./tools/x402Payment";

// Import actions
import x402PaymentAction from "./actions/x402Payment";

// Define and export the plugin
const PaymentsPlugin = {
  name: "payments",

  // Combine all tools
  methods: {
    makeX402PaymentRequest,
    getX402PaymentInfo,
  },

  // Combine all actions
  actions: [
    x402PaymentAction,
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
export { makeX402PaymentRequest, getX402PaymentInfo } from "./tools/x402Payment";
export { default as x402PaymentAction } from "./actions/x402Payment";