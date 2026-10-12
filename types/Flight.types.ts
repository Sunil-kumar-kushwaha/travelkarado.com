

export interface FlightResult {
    id: string;
    flightId: string;
    flightNumber: string;
    airline: string; // single field — your Flight model doesn't separate code/name
    source: string;
    destination: string;
    departureTime: string; // ISO datetime
    arrivalTime: string; // ISO datetime
    duration: string; // e.g. "5h 50m" — a formatted string, not minutes
    price: number;
    availableSeats: number;
    cabinClass: string;
    stops: number;
    supplier: string;
    fareKey: string;
}

export interface SearchMeta {
    minPrice: number;
    maxPrice: number;
    airlines: { code: string; minFare: number }[];
    stopsAvailable: { stops: number; label: string; minFare: number }[];
}

export interface FlightSearchApiResponse {
    supportedCities: string[];
    source: string | null;
    destination: string | null;
    departureDate: string | null;
    passengers: number;
    total: number;
    page: number;
    limit: number;
    flights: FlightResult[];
    meta: SearchMeta;
}

export interface FilterState {
    stops: number[];
    airlines: string[]; // selected airline values
    timings: string[];
    maxPrice: number | null;
}

export const EMPTY_FILTERS: FilterState = {
    stops: [],
    airlines: [],
    timings: [],
    maxPrice: null,
};