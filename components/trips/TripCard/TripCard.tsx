"use client";

import Link from "next/link";
import { TripSummary } from "@/types/trips.types";
import { STATUS_LABEL, formatDate, formatINR, formatTime, stopsLabel } from "@/utils/tripFormat";
import "../trips.css";

export default function TripCard({ trip }: { trip: TripSummary }) {
    const href = `/accounts/trips/${trip.type}/${trip.id}`;

    return (
        <article className="tripCard">
            <header className="tripCard__head">
                <span className={`tripCard__type tripCard__type--${trip.type}`}>
                    {trip.type === "flight" ? "Flight" : "Hotel"}
                </span>
                <span className={`tripStatus tripStatus--${trip.status}`}>{STATUS_LABEL[trip.status]}</span>
            </header>

            {trip.type === "flight" ? (
                <div className="tripCard__body">
                    <p className="tripCard__route">
                        {trip.flight.source} <span className="tripCard__arrow">→</span> {trip.flight.destination}
                    </p>
                    <p className="tripCard__meta">
                        {trip.flight.airline} · {trip.flight.flightNumber} · {trip.flight.cabinClass} ·{" "}
                        {stopsLabel(trip.flight.stops)}
                    </p>
                    <p className="tripCard__meta">
                        {formatDate(trip.flight.departureTime)} · {formatTime(trip.flight.departureTime)} –{" "}
                        {formatTime(trip.flight.arrivalTime)} · {trip.passengers} traveller
                        {trip.passengers > 1 ? "s" : ""}
                    </p>
                </div>
            ) : (
                <div className="tripCard__body">
                    <p className="tripCard__route">{trip.hotel.name}</p>
                    <p className="tripCard__meta">{trip.hotel.city}</p>
                    <p className="tripCard__meta">
                        {formatDate(trip.hotel.checkIn)} – {formatDate(trip.hotel.checkOut)} · {trip.hotel.rooms} room
                        {trip.hotel.rooms > 1 ? "s" : ""} · {trip.guests} guest{trip.guests > 1 ? "s" : ""}
                    </p>
                </div>
            )}

            <footer className="tripCard__foot">
                <div>
                    <p className="tripCard__small">Booked on {formatDate(trip.createdAt)}</p>
                    <p className="tripCard__total">{formatINR(trip.totalPrice)}</p>
                </div>
                <Link href={href} className="tripCard__btn">
                    Booking details
                </Link>
            </footer>
        </article>
    );
}