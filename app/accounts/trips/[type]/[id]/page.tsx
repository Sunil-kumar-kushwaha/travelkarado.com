"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import apiClient, { ApiError } from "@/utils/ApiClient";
import { FlightBookingDetail } from "@/types/trips.types";
import FlightBookingDetails from "@/components/trips/FlightBookingDetails/FlightBookingDetails";
import "@/components/trips/trips.css";

export default function TripDetailsPage() {
    const { type, id } = useParams<{ type: string; id: string }>();
    const [booking, setBooking] = useState<FlightBookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (type !== "flight") {
            setLoading(false);
            return;
        }
        let cancelled = false;
        apiClient
            .get<{ data: FlightBookingDetail }>(`/api/bookings/${id}`)
            .then((res) => !cancelled && setBooking(res.data))
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof ApiError && err.status === 404 ? "Booking not found." : "Could not load this booking.");
            })
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [type, id]);

    return (
        <section className="trips">
            <Link href="/accounts/trips" className="tripBack">← Back to My Trips</Link>

            {loading && <p className="trips__status">Loading booking…</p>}
            {error && <p className="trips__error">{error}</p>}
            {type === "hotel" && <p className="trips__status">Hotel booking details are coming soon.</p>}
            {booking && <FlightBookingDetails booking={booking} />}
        </section>
    );
}