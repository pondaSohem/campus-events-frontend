const BASE_URL = (
  import.meta.env.VITE_API_URL as string | undefined
  )?.replace(/\/$/,"")??"http://localhost:5229/api";

const DEMO_ADMIN_TOKEN = import.meta.env.VITE_DEMO_ADMIN_TOKEN as string | undefined;

export class ApiError extends Error
{
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body">
{
  body?: unknown;
  requiresAdmin?: boolean;
}

function getErrorMessage(data: unknown, status: number): string
{
  if (data && typeof data === "object")
  {
    const value = data as
    {
      message?: string;
      title?: string;
      detail?: string;
      errors?: Record<string, string[] | string>;
    };

    if (value.message) return value.message;
    if (value.detail) return value.detail;
    if (value.title) return value.title;

    if (value.errors)
    {
      const first = Object.values(value.errors)[0];

      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
  }

  if (status === 401)
  {
    return "Authentication is required. Check your test token.";
  }
  if (status === 403)
  {
    return "You do not have permission to perform this action.";
  }

  return `Request failed (HTTP ${status}).`;
}

export default async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T>
{
  const{
    body,
    headers,
    requiresAdmin = false,
    ...rest
  } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type"))
  {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (requiresAdmin && DEMO_ADMIN_TOKEN?.trim())
  {
    requestHeaders.set(
      "Authorisation",
      ` Bearer ${DEMO_ADMIN_TOKEN.trim()}`
    );
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new ApiError(
      response.status,
      getErrorMessage(data, response.status)
    );
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}
