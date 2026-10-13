"use client";


import { ReactNode, useCallback } from "react";
import LoginModal from "@/components/LoginModal/LoginModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openLoginModal, closeLoginModal } from "@/store/slices/loginModalSlice";

export function LoginModalProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.loginModal.isOpen);

    return (
        <>
            {children}
            {isOpen && <LoginModal onClose={() => dispatch(closeLoginModal())} />}
        </>
    );
}

export function useLoginModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.loginModal.isOpen);

    const open = useCallback(() => dispatch(openLoginModal()), [dispatch]);
    const close = useCallback(() => dispatch(closeLoginModal()), [dispatch]);

    return { isOpen, open, close };
}