"use client";



import { SelectedFlight } from "@/types/booking.types";
import "./FlightSummaryCard.css";

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function FlightSummaryCard({ flight, passengers }: { flight: SelectedFlight; passengers: number }) {
    const stopsLabel = flight.stops === 0 ? "Non stop" : flight.stops === 1 ? "1 stop" : `${flight.stops} stops`;

    return (
        <div className="flightSummaryCard">
            <div className="flightSummaryCard__airline">
                <div className="flightSummaryCard__icon">{flight.airline}</div>
                <div>
                    <p className="flightSummaryCard__name">{flight.airline}</p>
                    <p className="flightSummaryCard__number">{flight.flightNumber}</p>
                </div>
            </div>

            <div className="flightSummaryCard__route">
                <div className="flightSummaryCard__point">
                    <span className="flightSummaryCard__time">{formatTime(flight.departureTime)}</span>
                    <span className="flightSummaryCard__code">{flight.source}</span>
                </div>
                <div className="flightSummaryCard__mid">
                    <span>{flight.duration}</span>
                    <span>{stopsLabel}</span>
                </div>
                <div className="flightSummaryCard__point">
                    <span className="flightSummaryCard__time">{formatTime(flight.arrivalTime)}</span>
                    <span className="flightSummaryCard__code">{flight.destination}</span>
                </div>
            </div>

            <div className="flightSummaryCard__meta">
                <span>{flight.cabinClass}</span>
                <span>
                    {passengers} Traveller{passengers > 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
}