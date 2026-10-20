export interface AssistantFlight {
    id?: string;
    flightId: string;
    flightNumber: string;
    airline: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    cabinClass: string;
    stops: number;
    supplier: string;
    fareKey: string;
}

export interface AssistantHotel {
    hotelId: string;
    name: string;
    city: string;
    area: string;
    stars: number;
    rating: number;
    pricePerNight: number;
    totalPrice: number;
    nights: number;
    amenities: string[];
}

export type UiPayload =
    | { kind: "flights"; flights: AssistantFlight[]; total: number; search: { source: string; destination: string; departureDate: string; passengers: number } }
    | { kind: "hotels"; hotels: AssistantHotel[]; search: { city: string; checkIn: string; checkOut: string; guests: number } }
    | { kind: "start_booking"; flight: AssistantFlight; passengers: number };

export interface AssistantReply {
    sessionId: string;
    reply: string;
    ui: UiPayload[];
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    text: string;
    ui?: UiPayload[];
}