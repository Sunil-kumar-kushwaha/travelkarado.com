"use client";


import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import LoginModal from "@/components/LoginModal/LoginModal";

interface LoginModalContextValue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <LoginModalContext.Provider value={{ isOpen, open, close }}>
            {children}
            {isOpen && <LoginModal onClose={close} />}
        </LoginModalContext.Provider>
    );
}

export function useLoginModal(): LoginModalContextValue {
    const ctx = useContext(LoginModalContext);
    if (!ctx) {
        throw new Error("useLoginModal must be used inside a <LoginModalProvider>");
    }
    return ctx;
}