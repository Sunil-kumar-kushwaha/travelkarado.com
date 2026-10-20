"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import apiClient, { ApiError } from "@/utils/ApiClient";
import { AssistantFlight, AssistantReply, ChatMessage } from "@/types/assistant.types";

const GREETING: ChatMessage = {
    id: "greeting",
    role: "assistant",
    text: "Hi! I can find flights and hotels for you. Where would you like to go?",
};

let counter = 0;
const nextId = () => `m${Date.now()}-${counter++}`;

interface Options {
    onReply: (text: string) => void;
    // return a string to show it as an assistant note (e.g. "please log in first")
    onStartBooking: (flight: AssistantFlight, passengers: number) => string | void;
}

export function useAssistantChat(options: Options) {
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [loading, setLoading] = useState(false);
    const sessionRef = useRef<string | undefined>(undefined);
    const busyRef = useRef(false);

    // keep the latest callbacks without re-creating send()
    const cb = useRef(options);
    useEffect(() => {
        cb.current = options;
    });

    const note = useCallback((text: string) => {
        setMessages((m) => [...m, { id: nextId(), role: "assistant", text }]);
    }, []);

    const send = useCallback(
        async (raw: string) => {
            const text = raw.trim();
            if (!text || busyRef.current) return;

            busyRef.current = true;
            setLoading(true);
            setMessages((m) => [...m, { id: nextId(), role: "user", text }]);

            try {
                const res = await apiClient.post<{ data: AssistantReply }>(
                    "/api/assistant/chat",
                    { sessionId: sessionRef.current, message: text },
                    { timeout: 60000 }
                );
                const { sessionId, reply, ui } = res.data;
                sessionRef.current = sessionId;

                setMessages((m) => [...m, { id: nextId(), role: "assistant", text: reply, ui }]);
                cb.current.onReply(reply);

                for (const u of ui) {
                    if (u.kind === "start_booking") {
                        const msg = cb.current.onStartBooking(u.flight, u.passengers);
                        if (msg) note(msg);
                    }
                }
            } catch (err) {
                const tooMany = err instanceof ApiError && err.status === 429;
                note(
                    tooMany
                        ? "You're sending messages too quickly. Please wait a moment and try again."
                        : "Sorry, something went wrong. Please try again."
                );
            } finally {
                busyRef.current = false;
                setLoading(false);
            }
        },
        [note]
    );

    const reset = useCallback(() => {
        sessionRef.current = undefined;
        setMessages([GREETING]);
    }, []);

    return { messages, loading, send, note, reset };
}