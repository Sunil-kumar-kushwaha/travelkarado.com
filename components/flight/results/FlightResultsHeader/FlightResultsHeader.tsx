
"use client";



import Link from "next/link";
import "./FlightResultsHeader.css";

interface FlightResultsHeaderProps {
    from: string;
    to: string;
    departDate: string; // YYYY-MM-DD
    tripType: string;
    travellerSummary: string; // e.g. "1 Traveller, Economy"
}

export default function FlightResultsHeader({ from, to, departDate, tripType, travellerSummary }: FlightResultsHeaderProps) {
    const dateLabel = new Date(departDate).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="flightResultsHeader">
            <span className="flightResultsHeader__pill">{tripType === "roundtrip" ? "Round trip" : "One way"}</span>
            <span className="flightResultsHeader__route">
                {from} <span className="flightResultsHeader__arrow">→</span> {to}
            </span>
            <span className="flightResultsHeader__date">{dateLabel}</span>
            <span className="flightResultsHeader__travellers">{travellerSummary}</span>
            <Link href="/" className="flightResultsHeader__modify">
                Modify search
            </Link>
        </div>
    );
}