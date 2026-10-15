import 'server-only';

// The only module that reads secrets. 'server-only' makes importing it from a client
// component a build error, and neither variable has a NEXT_PUBLIC_ prefix, so Next
// never inlines them into browser JavaScript.
function required(name) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(
      `${name} is missing or under 32 characters. Locally it goes in .env.local (see .env.example); on Vercel under Settings → Environment Variables, with separate values for Production and Preview.`,
    );
  }
  return value;
}

export const getSessionSecret = () => required('SESSION_SECRET');
export const getPaymentWebhookSecret = () => required('PAYMENT_WEBHOOK_SECRET');
