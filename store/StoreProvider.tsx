"use client";


import { ReactNode, useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { hydrateBooking } from "./slices/bookingSlice";
import { setLoggedIn } from "./slices/authSlice";
import apiClient from "@/utils/ApiClient";

const STORAGE_KEY = "bookingDraft";

export default function StoreProvider({ children }: { children: ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useEffect(() => {
        const store = storeRef.current!;

        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) store.dispatch(hydrateBooking(JSON.parse(stored)));
        } catch {
            // corrupt or unavailable storage: start with an empty draft
        }

        store.dispatch(setLoggedIn(apiClient.isLoggedIn()));

        
        const unsubscribe = store.subscribe(() => {
            try {
                const draft = store.getState().booking.draft;
                if (draft) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
                else sessionStorage.removeItem(STORAGE_KEY);
            } catch {
                // storage full or unavailable: booking still works in memory
            }
        });

        return unsubscribe;
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}