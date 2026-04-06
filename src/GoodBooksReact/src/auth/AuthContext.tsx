import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EMAIL_KEY, TOKEN_KEY } from "../api/client";

export type AuthContextValue = {
    token: string | null;
    email: string | null;
    setSession: (token: string, email: string) => void;
    clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
    const [email, setEmail] = useState<string | null>(() => sessionStorage.getItem(EMAIL_KEY));

    const setSession = useCallback((t: string, e: string) => {
        sessionStorage.setItem(TOKEN_KEY, t);
        sessionStorage.setItem(EMAIL_KEY, e);
        setToken(t);
        setEmail(e);
    }, []);

    const clearSession = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(EMAIL_KEY);
        setToken(null);
        setEmail(null);
    }, []);

    const value = useMemo(
        () => ({ token, email, setSession, clearSession }),
        [token, email, setSession, clearSession]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
