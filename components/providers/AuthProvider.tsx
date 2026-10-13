"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { subscribeToAuth } from "@/firebase-actions";
import type { UserProfile } from "@/lib/types";

interface AuthState {
  profile: UserProfile | null;
  /** True until the first auth check has finished. */
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ profile: null, loading: true });

  useEffect(
    () => subscribeToAuth((profile) => setState({ profile, loading: false })),
    [],
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
