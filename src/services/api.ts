const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:5229/api";
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}
function errorMessage(data: unknown, status: number) {
  if (data && typeof data === "object") {
    const d = data as {
      message?: string;
      title?: string;
      detail?: string;
      errors?: Record<string, string | string[]>;
    };
    if (d.message) return d.message;
    if (d.detail) return d.detail;
    if (d.title) return d.title;
    if (d.errors) {
      const first = Object.values(d.errors)[0];
      return Array.isArray(first) ? first[0] : first;
    }
  }
  return status === 401
    ? "Please sign in to continue."
    : status === 403
      ? "You do not have permission to perform this action."
      : `Request failed (HTTP ${status}).`;
}
export default async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const h = new Headers(headers);
  const token = localStorage.getItem("campusevents.auth");
  if (token) {
    try {
      const auth = JSON.parse(token) as { token?: string };
      if (auth.token) h.set("Authorization", `Bearer ${auth.token}`);
    } catch {
      /* ignore malformed local state */
    }
  }
  if (body !== undefined && !h.has("Content-Type"))
    h.set("Content-Type", "application/json");
  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, errorMessage(data, response.status));
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
