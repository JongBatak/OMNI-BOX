"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  tier: string;
  metrics?: {
    storage_used: number;
    social_score: number;
    performance_rating: number;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// ── Constants ────────────────────────────────────────────────────────────────────

const API_BASE = "/api/v1";
const TOKEN_KEY = "omnibox_token";

// ── Context ──────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helper: Parse error from Laravel JSON response ───────────────────────────────

async function parseErrorResponse(res: Response): Promise<string> {
  // 429 Too Many Requests – rate limiting
  if (res.status === 429) {
    return "Too many attempts. Please try again in a minute.";
  }

  try {
    const data = await res.json();

    // Laravel validation errors (422): { message: "...", errors: { field: ["msg"] } }
    if (data.errors && typeof data.errors === "object") {
      const firstField = Object.keys(data.errors)[0];
      const messages: string[] = data.errors[firstField];
      return messages?.[0] ?? data.message ?? "Validation failed.";
    }

    // Generic { message: "..." }
    if (data.message) {
      return data.message;
    }
  } catch {
    // Response wasn't JSON
  }

  return `Request failed (${res.status})`;
}

// ── Provider ─────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Guard against double-invocation in React 18 Strict Mode
  const didInit = useRef(false);

  // ── Boot: validate token on mount ──────────────────────────────────────────
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    // Validate session against backend
    fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          setState({
            user: json.data,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token invalid — clean up
          localStorage.removeItem(TOKEN_KEY);
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      })
      .catch(() => {
        // Network error — don't nuke the token, just mark as not loading
        setState((s) => ({ ...s, isLoading: false }));
      });
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const error = await parseErrorResponse(res);
          return { success: false, error };
        }

        const json = await res.json();
        const token = json.access_token;
        const user = json.data;

        localStorage.setItem(TOKEN_KEY, token);
        setState({ user, token, isAuthenticated: true, isLoading: false });

        return { success: true };
      } catch {
        return { success: false, error: "Network error. Please check your connection." };
      }
    },
    []
  );

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        });

        if (!res.ok) {
          const error = await parseErrorResponse(res);
          return { success: false, error };
        }

        const json = await res.json();
        const token = json.access_token;
        const user = json.data;

        localStorage.setItem(TOKEN_KEY, token);
        setState({ user, token, isAuthenticated: true, isLoading: false });

        return { success: true };
      } catch {
        return { success: false, error: "Network error. Please check your connection." };
      }
    },
    []
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const currentToken = state.token || localStorage.getItem(TOKEN_KEY);

    // Immediately clear client state regardless of backend response
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });

    if (currentToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: "application/json",
          },
        });
      } catch {
        // Swallow — client is already logged out
      }
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
