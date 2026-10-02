import { createHmac, timingSafeEqual } from 'node:crypto';
import { jsonError } from '@/lib/http';
import { getOrder, markPaid } from '@/lib/orders';
import { getPaymentWebhookSecret } from '@/lib/secrets';

// POST /api/payments/confirm — called by the payment provider (TeleBirr / CBE Birr),
// something we do not control, so it is a route handler rather than a server action.
// The provider signs the raw body with a shared secret:
//   x-addis-signature: hex(HMAC-SHA256(PAYMENT_WEBHOOK_SECRET, rawBody))
// Body: { "orderId": "AE-1A2B3C4D", "reference": "TB-123456" }
export async function POST(request) {
  const rawBody = await request.text();

  const expected = createHmac('sha256', getPaymentWebhookSecret()).update(rawBody).digest('hex');
  const received = request.headers.get('x-addis-signature') ?? '';
  const valid =
    received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  if (!valid) {
    return jsonError(401, 'Invalid signature');
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError(400, 'Request body must be valid JSON');
  }

  const fieldErrors = {};
  if (typeof body?.orderId !== 'string' || !body.orderId) fieldErrors.orderId = 'orderId is required.';
  if (typeof body?.reference !== 'string' || !body.reference) fieldErrors.reference = 'reference is required.';
  if (Object.keys(fieldErrors).length > 0) {
    return jsonError(422, 'Validation failed', { fieldErrors });
  }

  const order = await getOrder(body.orderId);
  if (!order) {
    return jsonError(404, 'Order not found');
  }
  if (order.status === 'cancelled') {
    return jsonError(409, 'Order was cancelled; refund instead of capturing');
  }
  if (order.payment.status === 'paid') {
    return Response.json({ id: order.id, payment: order.payment }); // idempotent repeat
  }

  const updated = await markPaid(order.id, body.reference);
  return Response.json({ id: updated.id, payment: updated.payment });
}
