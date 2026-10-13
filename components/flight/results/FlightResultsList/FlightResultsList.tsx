
"use client";



import { FlightResult } from "@/types/Flight.types";

import FlightResultCard from "@/components/flight/results/FlightResultCard/FlightResultCard";

interface FlightResultsListProps {
    flights: FlightResult[];
    onBook: (flight: FlightResult) => void;
}

export default function FlightResultsList({ flights, onBook }: FlightResultsListProps) {
    if (flights.length === 0) {
        return (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#6b7280" }}>
                No flights match the selected filters. Try clearing a few.
            </div>
        );
    }

    return (
        <div>
            {flights.map((flight) => (
                <FlightResultCard key={flight.flightId} flight={flight} onBook={onBook} />
            ))}
        </div>
    );
}