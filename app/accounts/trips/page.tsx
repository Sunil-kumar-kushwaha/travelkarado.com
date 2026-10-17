"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import apiClient from "@/utils/ApiClient";
import { TripListResponse, TripSummary } from "@/types/trips.types";
import TripCard from "@/components/trips/TripCard/TripCard";
import "@/components/trips/trips.css";

const PAGE_SIZE = 10;
type Tab = "all" | "flight" | "hotel";
const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "flight", label: "Flights" },
    { key: "hotel", label: "Hotels" },
];

export default function TripsPage() {
    const [trips, setTrips] = useState<TripSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tab, setTab] = useState<Tab>("all");

    const load = useCallback(async (nextPage: number) => {
        setLoading(true);
        setError("");
        try {
            const res = await apiClient.get<{ data: TripListResponse }>("/api/bookings", {
                page: nextPage,
                limit: PAGE_SIZE,
            });
            setTrips((prev) => (nextPage === 1 ? res.data.trips : [...prev, ...res.data.trips]));
            setTotal(res.data.total);
            setPage(nextPage);
        } catch {
            setError("Could not load your trips. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(1);
    }, [load]);

    const visible = useMemo(() => (tab === "all" ? trips : trips.filter((t) => t.type === tab)), [trips, tab]);

    return (
        <section className="trips">
            <h1 className="trips__title">My Trips</h1>

            <div className="trips__tabs" role="tablist">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        role="tab"
                        aria-selected={tab === t.key}
                        className={`trips__tab ${tab === t.key ? "trips__tab--active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {error && (
                <p className="trips__error">
                    {error} <button className="trips__retry" onClick={() => load(1)}>Retry</button>
                </p>
            )}

            {!error && !loading && visible.length === 0 && (
                <div className="trips__empty">
                    <p>No {tab === "all" ? "" : tab} bookings yet.</p>
                    <Link href="/flights" className="tripCard__btn">Search flights</Link>
                </div>
            )}

            <div className="trips__list">
                {visible.map((trip) => (
                    <TripCard key={`${trip.type}-${trip.id}`} trip={trip} />
                ))}
            </div>

            {loading && <p className="trips__status">Loading your trips…</p>}

            {!loading && trips.length < total && (
                <button className="trips__more" onClick={() => load(page + 1)}>Load more</button>
            )}
        </section>
    );
}