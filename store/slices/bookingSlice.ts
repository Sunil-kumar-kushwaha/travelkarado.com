
// Replaces the state logic that lived inside context/BookingContext.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    AddonSelection,
    AppliedOffer,
    BookingDraft,
    InsuranceSelection,
    SelectedFlight,
    TravellerDetails,
} from "@/types/booking.types";
import { isInternationalRoute } from "@/utils/domesticAirports";

interface BookingState {
    draft: BookingDraft | null;
}

const initialState: BookingState = { draft: null };

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

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        startBooking(state, action: PayloadAction<{ flight: SelectedFlight; passengers: number }>) {
            const { flight, passengers } = action.payload;
            const travellers = buildDefaultTravellers(passengers);
            state.draft = {
                flight,
                passengers,
                isInternational: isInternationalRoute(flight.source, flight.destination),
                travellers,
                addons: buildDefaultAddons(travellers),
                insurance: { opted: false, planPrice: 149 },
                contact: { email: "", phone: "" },
                appliedOffer: null,
            };
        },
        // used by StoreProvider to restore an in-progress booking after a page refresh
        hydrateBooking(state, action: PayloadAction<BookingDraft>) {
            state.draft = action.payload;
        },
        updateTravellers(state, action: PayloadAction<TravellerDetails[]>) {
            if (state.draft) state.draft.travellers = action.payload;
        },
        updateAddons(state, action: PayloadAction<AddonSelection[]>) {
            if (state.draft) state.draft.addons = action.payload;
        },
        updateInsurance(state, action: PayloadAction<InsuranceSelection>) {
            if (state.draft) state.draft.insurance = action.payload;
        },
        updateContact(state, action: PayloadAction<{ email: string; phone: string }>) {
            if (state.draft) state.draft.contact = action.payload;
        },
        applyOffer(state, action: PayloadAction<AppliedOffer | null>) {
            if (state.draft) state.draft.appliedOffer = action.payload;
        },
        clearBooking(state) {
            state.draft = null;
        },
    },
});

export const {
    startBooking,
    hydrateBooking,
    updateTravellers,
    updateAddons,
    updateInsurance,
    updateContact,
    applyOffer,
    clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;