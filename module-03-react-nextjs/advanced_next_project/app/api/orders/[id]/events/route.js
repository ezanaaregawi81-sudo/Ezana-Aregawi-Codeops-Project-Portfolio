import { toTrackedOrder } from '@/lib/courier';
import { errorResponse } from '@/lib/api-errors';
import { getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/session';

// GET /api/orders/:id/events: the tracker's live feed, as Server-Sent Events.
// A long-lived response, so: no caching, no prerendering, and the Node runtime.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const EVERY_MS = 2000;
const KEEP_ALIVE_MS = 15000;
const ENDED = ['delivered', 'cancelled'];

// Streams open on this server right now, logged as they open and close. That's how the
// "navigate away five times" check is read from the server's side, not only the browser's.
const live = globalThis.__aeLiveFeeds ?? (globalThis.__aeLiveFeeds = new Set());

// One SSE message. The format is plain text: a line per field ("id: 4"), and the payload as
// "data: " + JSON followed by two newlines. The first newline ends the data line; the second
// leaves a blank line, which is what ends the message. With only one, the browser keeps waiting
// and never fires the event.
const message = (id, event, payload) => `id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

export async function GET(request, { params }) {
  const { id } = await params;

  // Same rules as GET /api/orders/:id, checked before anything is streamed. An error status
  // (instead of a 200 stream) also stops EventSource from reconnecting.
  const session = await getSession();
  if (!session) return errorResponse(401, 'UNAUTHORIZED', 'Please sign in to track an order.');

  const order = getOrderById(id);
  if (!order || order.ownerId !== session.id) {
    return errorResponse(404, 'NOT_FOUND', `No order with id "${id}".`);
  }

  const encoder = new TextEncoder();
  const timers = [];
  const clearTimers = () => timers.forEach(clearInterval);

  const body = new ReadableStream({
    start(controller) {
      let n = Number(request.headers.get('last-event-id')) || 0;
      let previousStatus;
      let open = true;
      const write = (text) => controller.enqueue(encoder.encode(text));

      const feed = Symbol(id);
      const end = (reason) => {
        if (!open) return;
        open = false;
        clearTimers();
        live.delete(feed);
        console.log(`[events] ${id} closed (${reason}), ${live.size} open`);
        try {
          controller.close();
        } catch {
          // The browser already went away.
        }
      };

      const tick = () => {
        const current = getOrderById(id);
        if (!current) return end('order gone');
        n += 1;
        // "step" when the order moves to a new step, "move" for the courier in between.
        write(message(n, current.status === previousStatus ? 'move' : 'step', toTrackedOrder(current)));
        previousStatus = current.status;

        // Finished: one "end" message, then the server closes the stream on purpose.
        if (ENDED.includes(current.status)) {
          write(message(n + 1, 'end', { status: current.status }));
          end(current.status);
        }
      };

      live.add(feed);
      console.log(`[events] ${id} opened, ${live.size} open`);
      write('retry: 4000\n\n'); // wait 4 s before reconnecting after a dropped connection
      tick();
      if (!open) return;
      timers.push(setInterval(tick, EVERY_MS));
      // A comment line keeps idle proxies from closing the connection between messages.
      timers.push(setInterval(() => write(': still here\n\n'), KEEP_ALIVE_MS));
      request.signal.addEventListener('abort', () => end('browser left'));
    },
    cancel: clearTimers,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
