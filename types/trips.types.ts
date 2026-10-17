import {
    AddonSelection,
    AppliedOffer,
    InsuranceSelection,
    PriceBreakup,
    SelectedFlight,
    TravellerDetails,
} from "./booking.types";

export type BookingStatus = "pending" | "paid" | "failed" | "cancelled";

interface BaseTrip {
    id: string;
    status: BookingStatus;
    createdAt: number;
    totalPrice: number;
}

export interface FlightTripSummary extends BaseTrip {
    type: "flight";
    passengers: number;
    flight: {
        airline: string;
        flightNumber: string;
        source: string;
        destination: string;
        departureTime: string;
        arrivalTime: string;
        stops: number;
        cabinClass: string;
    };
}

export interface HotelTripSummary extends BaseTrip {
    type: "hotel";
    guests: number;
    hotel: { name: string; city: string; checkIn: string; checkOut: string; rooms: number };
}

export type TripSummary = FlightTripSummary | HotelTripSummary;

export interface TripListResponse {
    trips: TripSummary[];
    total: number;
    page: number;
    limit: number;
}

export interface FlightBookingDetail {
    id: string;
    type: "flight";
    status: BookingStatus;
    paymentRef?: string;
    createdAt: number;
    flight: SelectedFlight;
    passengers: number;
    isInternational: boolean;
    travellers: TravellerDetails[];
    addons: AddonSelection[];
    insurance: InsuranceSelection;
    contact: { email: string; phone: string };
    appliedOffer: AppliedOffer | null;
    priceBreakup: PriceBreakup;
}