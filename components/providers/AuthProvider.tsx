"use client";

import { createContext, useContext } from "react";
import type { SessionPayload } from "@/lib/auth";

const AuthContext = createContext<SessionPayload | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: SessionPayload | null;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
