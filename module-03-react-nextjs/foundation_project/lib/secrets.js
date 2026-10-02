import 'server-only';

// The only module that reads secrets. 'server-only' makes importing it from a client
// component a build error, and neither variable has a NEXT_PUBLIC_ prefix, so Next
// never inlines them into browser JavaScript.
function required(name) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`${name} must be set in .env.local (at least 32 characters). See .env.example.`);
  }
  return value;
}

export const getSessionSecret = () => required('SESSION_SECRET');
export const getPaymentWebhookSecret = () => required('PAYMENT_WEBHOOK_SECRET');
