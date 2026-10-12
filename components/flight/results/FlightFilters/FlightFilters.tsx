"use client";


import { useMemo, useState } from "react";
import { FilterState, FlightResult, SearchMeta } from "@/types/Flight.types";
import { TIME_BUCKETS, getTimeBucketId } from "@/utils/timeBuckets";
import "./FlightFilters.css";

interface FlightFiltersProps {
    flights: FlightResult[];
    meta: SearchMeta;
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

const HISTOGRAM_BUCKETS = 8;

function toggleInArray<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FlightFilters({ flights, meta, filters, onChange }: FlightFiltersProps) {
    const [showAllAirlines, setShowAllAirlines] = useState(false);

    const timingCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const f of flights) {
            const bucket = getTimeBucketId(f.departureTime);
            counts[bucket] = (counts[bucket] || 0) + 1;
        }
        return counts;
    }, [flights]);

    const histogram = useMemo(() => {
        if (flights.length === 0 || meta.maxPrice === meta.minPrice) return [];

        const bucketSize = (meta.maxPrice - meta.minPrice) / HISTOGRAM_BUCKETS;
        const buckets = Array.from({ length: HISTOGRAM_BUCKETS }, (_, i) => ({
            from: Math.round(meta.minPrice + i * bucketSize),
            to: Math.round(meta.minPrice + (i + 1) * bucketSize),
            count: 0,
        }));

        for (const f of flights) {
            const index = Math.min(HISTOGRAM_BUCKETS - 1, Math.floor((f.price - meta.minPrice) / bucketSize));
            buckets[index].count += 1;
        }

        const maxCount = Math.max(...buckets.map((b) => b.count), 1);
        return buckets.map((b) => ({ ...b, heightPct: (b.count / maxCount) * 100 }));
    }, [flights, meta]);

    const visibleAirlines = showAllAirlines ? meta.airlines : meta.airlines.slice(0, 3);

    return (
        <aside className="flightFilters">
            <div className="flightFilters__section">
                <div className="flightFilters__header">
                    <span>Stops</span>
                    {filters.stops.length > 0 && (
                        <button className="flightFilters__clear" onClick={() => onChange({ ...filters, stops: [] })}>
                            Clear
                        </button>
                    )}
                </div>
                <div className="flightFilters__pillRow">
                    {meta.stopsAvailable.map((s) => (
                        <button
                            key={s.stops}
                            className={`flightFilters__pill${filters.stops.includes(s.stops) ? " flightFilters__pill--active" : ""}`}
                            onClick={() => onChange({ ...filters, stops: toggleInArray(filters.stops, s.stops) })}
                        >
                            <span className="flightFilters__pillLabel">{s.label}</span>
                            <span className="flightFilters__pillPrice">₹{s.minFare.toLocaleString("en-IN")}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flightFilters__section">
                <div className="flightFilters__header">
                    <span>Airlines</span>
                    {filters.airlines.length > 0 && (
                        <button className="flightFilters__clear" onClick={() => onChange({ ...filters, airlines: [] })}>
                            Clear
                        </button>
                    )}
                </div>
                {visibleAirlines.map((a) => (
                    <label key={a.code} className="flightFilters__checkRow">
                        <input
                            type="checkbox"
                            checked={filters.airlines.includes(a.code)}
                            onChange={() => onChange({ ...filters, airlines: toggleInArray(filters.airlines, a.code) })}
                        />
                        <span className="flightFilters__checkLabel">{a.code}</span>
                        <span className="flightFilters__checkPrice">₹{a.minFare.toLocaleString("en-IN")}</span>
                    </label>
                ))}
                {meta.airlines.length > 3 && (
                    <button className="flightFilters__showMore" onClick={() => setShowAllAirlines((v) => !v)}>
                        {showAllAirlines ? "Show less" : `Show ${meta.airlines.length - 3} more airline${meta.airlines.length - 3 > 1 ? "s" : ""}`}
                    </button>
                )}
            </div>

            <div className="flightFilters__section">
                <div className="flightFilters__header">
                    <span>Timings</span>
                    {filters.timings.length > 0 && (
                        <button className="flightFilters__clear" onClick={() => onChange({ ...filters, timings: [] })}>
                            Clear
                        </button>
                    )}
                </div>
                {TIME_BUCKETS.map((b) => (
                    <label key={b.id} className="flightFilters__checkRow">
                        <input
                            type="checkbox"
                            checked={filters.timings.includes(b.id)}
                            onChange={() => onChange({ ...filters, timings: toggleInArray(filters.timings, b.id) })}
                        />
                        <span className="flightFilters__checkLabel">{b.label}</span>
                        <span className="flightFilters__checkMuted">{b.range}</span>
                        <span className="flightFilters__checkCount">{timingCounts[b.id] || 0}</span>
                    </label>
                ))}
            </div>

            {histogram.length > 0 && (
                <div className="flightFilters__section">
                    <div className="flightFilters__header">
                        <span>Flight prices</span>
                        {filters.maxPrice !== null && (
                            <button className="flightFilters__clear" onClick={() => onChange({ ...filters, maxPrice: null })}>
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="flightFilters__histogram">
                        {histogram.map((b, i) => {
                            const isSelected = filters.maxPrice !== null && filters.maxPrice >= b.to;
                            return (
                                <button
                                    key={i}
                                    className={`flightFilters__bar${isSelected ? " flightFilters__bar--active" : ""}`}
                                    style={{ height: `${Math.max(b.heightPct, 6)}%` }}
                                    title={`₹${b.from.toLocaleString("en-IN")} - ₹${b.to.toLocaleString("en-IN")} (${b.count} flights)`}
                                    onClick={() => onChange({ ...filters, maxPrice: filters.maxPrice === b.to ? null : b.to })}
                                />
                            );
                        })}
                    </div>
                    <div className="flightFilters__histogramLabels">
                        <span>₹{meta.minPrice.toLocaleString("en-IN")}</span>
                        <span>₹{meta.maxPrice.toLocaleString("en-IN")}</span>
                    </div>
                </div>
            )}
        </aside>
    );
}