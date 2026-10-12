// The one error shape for every route handler and server action:
// { error: { code, message, fieldErrors? } }
export function errorBody(code, message, extra = {}) {
  return { error: { code, message, ...extra } };
}

export function errorResponse(status, code, message, extra) {
  return Response.json(errorBody(code, message, extra), { status });
}
