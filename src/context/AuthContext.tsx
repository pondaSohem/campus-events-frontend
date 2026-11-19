import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthResponse, LoginDto, RegisterDto } from "../types/Auth";

import { normaliseAuthResponse, extractRolesFromJwt } from "../types/Auth";

import { authService } from "../services/authService";

interface AuthContextValue {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (dto: LoginDto) => Promise<AuthResponse>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "campusevents.auth";

/**
 * Restore the user session from local storage.
 * It works in our context but is this a secure way?
 */
function getStoredUser(): AuthResponse | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    return normaliseAuthResponse(parsed);
  } catch (error) {
    console.error("Unable to restore authentication:", error);

    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(getStoredUser);

  /**
   * Persist the authenticated user.
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  /**
   * Authenticate the user.
   */
  async function login(dto: LoginDto): Promise<AuthResponse> {
    const response = await authService.login(dto);

    setUser(response);

    return response;
  }

  /**
   * Register a new user.
   */
  async function register(dto: RegisterDto): Promise<void> {
    await authService.register(dto);
  }

  /**
   * Logout the current user.
   */
  function logout(): void {
    setUser(null);
  }

  /**
   * Determine admin access directly from JWT claims.
   *
   * No dependency on the backend's single role property.
   */
  const isAdmin = user
    ? extractRolesFromJwt(user.token).includes("ADMIN")
    : false;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      isAdmin,
      login,
      register,
      logout,
    }),
    [user, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access authentication context.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
