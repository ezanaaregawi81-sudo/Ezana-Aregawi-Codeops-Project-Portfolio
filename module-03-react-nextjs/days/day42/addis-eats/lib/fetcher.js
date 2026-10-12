// Shared by every useSWR call in the app.
// A 404 or 500 doesn't make fetch() reject, and SWR only reports an error when the fetcher
// throws, so a non-OK response is thrown here with its status and our API error attached.
export async function fetcher(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error?.message ?? `Request to ${url} failed (${response.status})`);
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }

  return payload;
}
