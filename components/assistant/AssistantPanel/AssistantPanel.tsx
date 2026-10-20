"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMic, FiMicOff, FiSend, FiX, FiVolume2, FiVolumeX, FiRefreshCw } from "react-icons/fi";
import { useBooking } from "@/context/BookingContext";
import { useLoginModal } from "@/context/LoginModalContext";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatINR, formatTime, stopsLabel } from "@/utils/tripFormat";
import { AssistantFlight, ChatMessage, UiPayload } from "@/types/assistant.types";
import { useAssistantChat } from "../useAssistantChat";
import { useSpeech } from "../useSpeech";
import "./AssistantPanel.css";

const SUGGESTIONS = ["Flights to Goa", "Delhi to Bengaluru tomorrow", "Hotels in Mumbai"];

type FlightsUi = Extract<UiPayload, { kind: "flights" }>;
type HotelsUi = Extract<UiPayload, { kind: "hotels" }>;

function FlightCards({ ui, onBook, onNavigate }: { ui: FlightsUi; onBook: (f: AssistantFlight, pax: number) => void; onNavigate: () => void }) {
    const q = new URLSearchParams({
        source: ui.search.source,
        destination: ui.search.destination,
        departureDate: ui.search.departureDate,
        passengers: String(ui.search.passengers),
        tripType: "oneway",
    });
    return (
        <div className="aCards">
            {ui.flights.map((f) => (
                <div className="aFlight" key={f.flightId}>
                    <div className="aFlight__top">
                        <strong>{f.airline}</strong>
                        <span className="aFlight__num">{f.flightNumber}</span>
                    </div>
                    <div className="aFlight__times">
                        {formatTime(f.departureTime)} → {formatTime(f.arrivalTime)}
                        <span className="aFlight__dur">{f.duration} · {stopsLabel(f.stops)}</span>
                    </div>
                    <div className="aFlight__bottom">
                        <span className="aFlight__price">{formatINR(f.price)}</span>
                        <button className="aBtn" onClick={() => onBook(f, ui.search.passengers)}>Book</button>
                    </div>
                </div>
            ))}
            {ui.total > ui.flights.length && (
                <Link href={`/flights/results?${q.toString()}`} className="aLink" onClick={onNavigate}>
                    See all {ui.total} flights
                </Link>
            )}
        </div>
    );
}

function HotelCards({ ui }: { ui: HotelsUi }) {
    return (
        <div className="aCards">
            {ui.hotels.map((h) => (
                <div className="aFlight" key={h.hotelId}>
                    <div className="aFlight__top">
                        <strong>{h.name}</strong>
                        <span className="aFlight__num">{"★".repeat(h.stars)} {h.rating}</span>
                    </div>
                    <div className="aFlight__dur">{h.area}, {h.city} · {formatDate(ui.search.checkIn)} to {formatDate(ui.search.checkOut)}</div>
                    <div className="aChips">
                        {h.amenities.map((a) => <span key={a} className="aChip">{a}</span>)}
                    </div>
                    <div className="aFlight__bottom">
                        <span className="aFlight__price">
                            {formatINR(h.pricePerNight)}<small> / night</small>
                        </span>
                        <span className="aFlight__dur">{formatINR(h.totalPrice)} for {h.nights} night{h.nights > 1 ? "s" : ""}</span>
                    </div>
                </div>
            ))}
            <p className="aNote">Hotel booking opens soon.</p>
        </div>
    );
}

function MessageView({ m, onBook, onNavigate }: { m: ChatMessage; onBook: (f: AssistantFlight, pax: number) => void; onNavigate: () => void }) {
    return (
        <div className={`aMsg aMsg--${m.role}`}>
            <div className="aMsg__bubble">{m.text}</div>
            {m.ui?.map((u, i) =>
                u.kind === "flights" ? (
                    <FlightCards key={i} ui={u} onBook={onBook} onNavigate={onNavigate} />
                ) : u.kind === "hotels" ? (
                    <HotelCards key={i} ui={u} />
                ) : null
            )}
        </div>
    );
}

export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const { startBooking } = useBooking();
    const { loggedIn } = useAuth();
    const { open: openLogin } = useLoginModal();
    const { supported, listening, startListening, stopListening, speak, cancelSpeech } = useSpeech("en-IN");

    const [input, setInput] = useState("");
    const [voiceReplies, setVoiceReplies] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    // the same path is used for the card "Book" buttons and for "book the cheapest one" by chat or voice
    const bookFlight = (f: AssistantFlight, pax: number): string | void => {
        if (!loggedIn) {
            openLogin();
            return "Please log in first, then tap Book on the flight again.";
        }
        startBooking(
            {
                id: f.id ?? f.flightId,
                flightId: f.flightId,
                flightNumber: f.flightNumber,
                airline: f.airline,
                source: f.source,
                destination: f.destination,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                duration: f.duration,
                price: f.price,
                cabinClass: f.cabinClass,
                stops: f.stops,
                supplier: f.supplier,
                fareKey: f.fareKey,
            },
            pax
        );
        cancelSpeech();
        onClose();
        router.push("/flights/book");
    };

    const chat = useAssistantChat({
        onReply: (text) => {
            if (voiceReplies) speak(text);
        },
        onStartBooking: bookFlight,
    });

    const onCardBook = (f: AssistantFlight, pax: number) => {
        const msg = bookFlight(f, pax);
        if (msg) chat.note(msg);
    };

    // scroll to the newest message
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [chat.messages, chat.loading, open]);

    // hiding the panel stops the mic and any speech
    useEffect(() => {
        if (!open) {
            stopListening();
            cancelSpeech();
        }
    }, [open, stopListening, cancelSpeech]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const submit = (text: string) => {
        cancelSpeech();
        chat.send(text);
        setInput("");
    };

    const toggleMic = () => {
        if (listening) return stopListening();
        cancelSpeech();
        startListening(
            (text, isFinal) => {
                setInput(text);
                if (isFinal) submit(text); // a finished sentence is sent automatically
            },
            (code) => chat.note(code === "not-allowed"   ? "Microphone access is blocked. Allow it in your browser settings, or type instead." : "I couldn't hear that. Please try again." )
        );
    };

    const newChat = () => {
        cancelSpeech();
        chat.reset();
        setInput("");
    };

    return (
        <div className={`assistant ${open ? "" : "assistant--hidden"}`} role="dialog" aria-label="Travel assistant" aria-hidden={!open}>
            <header className="assistant__head">
                <div>
                    <strong>Travel assistant</strong>
                    <span className="assistant__sub">Flights and hotels, by chat or voice</span>
                </div>
                <div className="assistant__actions">
                    {supported && (
                        <button type="button" title={voiceReplies ? "Mute spoken replies" : "Read replies aloud"} onClick={() => { cancelSpeech(); setVoiceReplies((v) => !v); }}>
                            {voiceReplies ? <FiVolume2 /> : <FiVolumeX />}
                        </button>
                    )}
                    <button type="button" title="New chat" onClick={newChat}><FiRefreshCw /></button>
                    <button type="button" title="Close" onClick={onClose}><FiX /></button>
                </div>
            </header>

            <div className="assistant__list" ref={listRef}>
                {chat.messages.map((m) => (
                    <MessageView key={m.id} m={m} onBook={onCardBook} onNavigate={onClose} />
                ))}
                {chat.loading && (
                    <div className="aMsg aMsg--assistant">
                        <div className="aMsg__bubble aTyping"><span /><span /><span /></div>
                    </div>
                )}
            </div>

            {chat.messages.length === 1 && (
                <div className="assistant__suggest">
                    {SUGGESTIONS.map((s) => (
                        <button key={s} type="button" className="aChip aChip--btn" onClick={() => submit(s)}>{s}</button>
                    ))}
                </div>
            )}

            <form className="assistant__input" onSubmit={(e) => { e.preventDefault(); submit(input); }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={listening ? "Listening…" : "Type or tap the mic"}
                    maxLength={500}
                    aria-label="Message"
                />
                {supported && (
                    <button type="button" className={`assistant__mic ${listening ? "assistant__mic--on" : ""}`} onClick={toggleMic} aria-label={listening ? "Stop listening" : "Speak"}>
                        {listening ? <FiMicOff /> : <FiMic />}
                    </button>
                )}
                <button type="submit" className="assistant__send" disabled={!input.trim() || chat.loading} aria-label="Send"><FiSend /></button>
            </form>
        </div>
    );
}