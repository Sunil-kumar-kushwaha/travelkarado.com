"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech(lang = "en-IN") {
    const [supported, setSupported] = useState(false); // decided after mount, so the server and client first render match
    const [listening, setListening] = useState(false);
    const recRef = useRef<any>(null);

    useEffect(() => {
        const w = window as any;
        setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
        return () => {
            recRef.current?.abort?.();
            window.speechSynthesis?.cancel();
        };
    }, []);

    const startListening = useCallback(
        (onResult: (text: string, isFinal: boolean) => void, onError?: (code: string) => void) => {
            const w = window as any;
            const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
            if (!SR) return;

            const rec = new SR();
            rec.lang = lang;
            rec.interimResults = true;
            rec.continuous = false;
            rec.maxAlternatives = 1;

            rec.onresult = (e: any) => {
                let text = "";
                let isFinal = false;
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    text += e.results[i][0].transcript;
                    if (e.results[i].isFinal) isFinal = true;
                }
                onResult(text, isFinal);
            };
            rec.onerror = (e: any) => {
                setListening(false);
                onError?.(e.error);
            };
            rec.onend = () => setListening(false);

            recRef.current = rec;
            rec.start();
            setListening(true);
        },
        [lang]
    );

    const stopListening = useCallback(() => {
        recRef.current?.stop?.();
        setListening(false);
    }, []);

    const speak = useCallback(
        (text: string) => {
            if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            window.speechSynthesis.speak(u);
        },
        [lang]
    );

    const cancelSpeech = useCallback(() => {
        if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    }, []);

    return { supported, listening, startListening, stopListening, speak, cancelSpeech };
}