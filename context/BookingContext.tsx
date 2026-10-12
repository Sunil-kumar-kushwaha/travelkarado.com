"use client";



import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    AddonSelection,
    AppliedOffer,
    BookingDraft,
    InsuranceSelection,
    SelectedFlight,
    TravellerDetails,
} from "@/types/booking.types";
import { isInternationalRoute } from "@/utils/domesticAirports";

const STORAGE_KEY = "bookingDraft";

interface BookingContextValue {
    draft: BookingDraft | null;
    startBooking: (flight: SelectedFlight, passengers: number) => void;
    updateTravellers: (travellers: TravellerDetails[]) => void;
    updateAddons: (addons: AddonSelection[]) => void;
    updateInsurance: (insurance: InsuranceSelection) => void;
    updateContact: (contact: { email: string; phone: string }) => void;
    applyOffer: (offer: AppliedOffer | null) => void;
    clear: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

function buildDefaultTravellers(passengers: number): TravellerDetails[] {
    return Array.from({ length: passengers }, (_, i) => ({
        id: `traveller-${i + 1}`,
        type: "adult",
        isPrimary: i === 0,
        firstName: "",
        lastName: "",
        gender: "Male",
        passport: null,
    }));
}

function buildDefaultAddons(travellers: TravellerDetails[]): AddonSelection[] {
    return travellers.map((t) => ({ travellerId: t.id, meal: null, baggage: null, seat: null }));
}

export function BookingProvider({ children }: { children: ReactNode }) {
    const [draft, setDraft] = useState<BookingDraft | null>(null);

    // load any in-progress booking on first mount (survives a page refresh)
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) setDraft(JSON.parse(stored));
        } catch {
            // corrupt/missing storage — just start fresh
        }
    }, []);

    useEffect(() => {
        try {
            if (draft) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch {
            // storage full/unavailable — booking still works in-memory for this session
        }
    }, [draft]);

    const startBooking = useCallback((flight: SelectedFlight, passengers: number) => {
        const travellers = buildDefaultTravellers(passengers);
        setDraft({
            flight,
            passengers,
            isInternational: isInternationalRoute(flight.source, flight.destination),
            travellers,
            addons: buildDefaultAddons(travellers),
            insurance: { opted: false, planPrice: 149 },
            contact: { email: "", phone: "" },
            appliedOffer: null,
        });
    }, []);

    const updateTravellers = useCallback((travellers: TravellerDetails[]) => {
        setDraft((prev) => (prev ? { ...prev, travellers } : prev));
    }, []);

    const updateAddons = useCallback((addons: AddonSelection[]) => {
        setDraft((prev) => (prev ? { ...prev, addons } : prev));
    }, []);

    const updateInsurance = useCallback((insurance: InsuranceSelection) => {
        setDraft((prev) => (prev ? { ...prev, insurance } : prev));
    }, []);

    const updateContact = useCallback((contact: { email: string; phone: string }) => {
        setDraft((prev) => (prev ? { ...prev, contact } : prev));
    }, []);

    const applyOffer = useCallback((offer: AppliedOffer | null) => {
        setDraft((prev) => (prev ? { ...prev, appliedOffer: offer } : prev));
    }, []);

    const clear = useCallback(() => {
        setDraft(null);
        sessionStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <BookingContext.Provider
            value={{ draft, startBooking, updateTravellers, updateAddons, updateInsurance, updateContact, applyOffer, clear }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking(): BookingContextValue {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error("useBooking must be used inside a <BookingProvider>");
    return ctx;
}