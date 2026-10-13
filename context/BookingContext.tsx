"use client";



import { ReactNode, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    startBooking as startBookingAction,
    updateTravellers as updateTravellersAction,
    updateAddons as updateAddonsAction,
    updateInsurance as updateInsuranceAction,
    updateContact as updateContactAction,
    applyOffer as applyOfferAction,
    clearBooking,
} from "@/store/slices/bookingSlice";
import {
    AddonSelection,
    AppliedOffer,
    InsuranceSelection,
    SelectedFlight,
    TravellerDetails,
} from "@/types/booking.types";


export function BookingProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export function useBooking() {
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.booking.draft);

    const startBooking = useCallback(
        (flight: SelectedFlight, passengers: number) => dispatch(startBookingAction({ flight, passengers })),
        [dispatch]
    );
    const updateTravellers = useCallback(
        (travellers: TravellerDetails[]) => dispatch(updateTravellersAction(travellers)),
        [dispatch]
    );
    const updateAddons = useCallback((addons: AddonSelection[]) => dispatch(updateAddonsAction(addons)), [dispatch]);
    const updateInsurance = useCallback(
        (insurance: InsuranceSelection) => dispatch(updateInsuranceAction(insurance)),
        [dispatch]
    );
    const updateContact = useCallback(
        (contact: { email: string; phone: string }) => dispatch(updateContactAction(contact)),
        [dispatch]
    );
    const applyOffer = useCallback((offer: AppliedOffer | null) => dispatch(applyOfferAction(offer)), [dispatch]);
    const clear = useCallback(() => dispatch(clearBooking()), [dispatch]);

    return { draft, startBooking, updateTravellers, updateAddons, updateInsurance, updateContact, applyOffer, clear };
}