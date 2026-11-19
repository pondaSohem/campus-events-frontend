export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Extracts all role claims directly from the JWT payload.
 * Does not read the backend's role or roles response properties.
 */
export function extractRolesFromJwt(token: string): string[] {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return [];
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const binary = atob(padded);

    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );

    const payload = JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;

    const roleClaimNames = [
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
      "role",
      "roles",
    ];

    const extractedRoles: string[] = [];

    for (const claimName of roleClaimNames) {
      const value = payload[claimName];

      if (typeof value === "string") {
        extractedRoles.push(value);
      }

      if (Array.isArray(value)) {
        extractedRoles.push(
          ...value.filter((item): item is string => typeof item === "string"),
        );
      }
    }

    return [
      ...new Set(
        extractedRoles.map((role) => role.trim().toUpperCase()).filter(Boolean),
      ),
    ];
  } catch (error) {
    console.error("Unable to decode JWT roles:", error);
    return [];
  }
}

/**
 * Normalises the backend login response.
 * Only user information and the JWT are retained.
 */
export function normaliseAuthResponse(data: unknown): AuthResponse {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid login response from server.");
  }

  const response = data as Record<string, unknown>;

  function getString(...keys: string[]): string {
    for (const key of keys) {
      const value = response[key];

      if (typeof value === "string") {
        return value;
      }
    }

    return "";
  }

  const token = getString("token", "Token");

  if (!token) {
    throw new Error("The server did not return an authentication token.");
  }

  return {
    token,
    expiresAt: getString("expiresAt", "ExpiresAt"),
    userId: getString("userId", "UserId"),
    email: getString("email", "Email"),
    firstName: getString("firstName", "FirstName"),
    lastName: getString("lastName", "LastName"),
  };
}
