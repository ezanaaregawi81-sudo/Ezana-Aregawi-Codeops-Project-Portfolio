// One error shape for every route handler: { error: string, fieldErrors?: object }.
export function jsonError(status, error, extra = {}) {
  return Response.json({ error, ...extra }, { status });
}
