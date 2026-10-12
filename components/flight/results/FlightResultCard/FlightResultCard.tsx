"use client";

import { FlightResult } from "@/types/Flight.types";
import "./FlightResultCard.css";

interface FlightResultCardProps {
    flight: FlightResult;
    onBook: (flight: FlightResult) => void;
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function FlightResultCard({ flight, onBook }: FlightResultCardProps) {
    const stopsLabel = flight.stops === 0 ? "Non stop" : flight.stops === 1 ? "1 stop" : `${flight.stops} stops`;

    return (
        <div className="flightCard">
            <div className="flightCard__body">
                <div className="flightCard__airline">
                    <div className="flightCard__airlineIcon">{flight.airline}</div>
                    <div>
                        <p className="flightCard__airlineName">{flight.airline}</p>
                        <p className="flightCard__flightNumber">{flight.flightNumber}</p>
                    </div>
                </div>

                <div className="flightCard__timing">
                    <span className="flightCard__time">{formatTime(flight.departureTime)}</span>
                    <div className="flightCard__routeLine">
                        <span className="flightCard__duration">{flight.duration}</span>
                        <div className="flightCard__line" />
                        <span className="flightCard__stops">{stopsLabel}</span>
                    </div>
                    <span className="flightCard__time">{formatTime(flight.arrivalTime)}</span>
                </div>

                <div className="flightCard__priceBlock">
                    <span className="flightCard__price">₹{flight.price.toLocaleString("en-IN")}</span>
                    <button className="flightCard__bookBtn" onClick={() => onBook(flight)}>
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
}