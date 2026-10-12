"use client";

// ============================================================
// FRONTEND FILE (Next.js / React)
// Project path: components/flight/booking/ReviewSummary/ReviewSummary.tsx
// ============================================================

import { BookingDraft } from "@/types/booking.types";
import "./ReviewSummary.css";

interface ReviewSummaryProps {
    draft: BookingDraft;
    onEdit: () => void;
}

export default function ReviewSummary({ draft, onEdit }: ReviewSummaryProps) {
    return (
        <div className="reviewSummary">
            <div className="reviewSummary__header">
                <h3>Review your details</h3>
                <button onClick={onEdit}>Edit</button>
            </div>

            <section className="reviewSummary__section">
                <h4>Flight</h4>
                <p>
                    {draft.flight.airline} {draft.flight.flightNumber} · {draft.flight.source} → {draft.flight.destination}
                </p>
                <p className="reviewSummary__muted">
                    {new Date(draft.flight.departureTime).toLocaleString("en-IN")} · {draft.flight.duration} · {draft.flight.cabinClass}
                </p>
            </section>

            <section className="reviewSummary__section">
                <h4>Travellers</h4>
                {draft.travellers.map((t, i) => (
                    <p key={t.id}>
                        {t.firstName || "—"} {t.lastName || ""} ({t.gender}){t.isPrimary && " · Primary"}
                        {draft.isInternational && t.passport?.number && ` · Passport ${t.passport.number}`}
                    </p>
                ))}
                <p className="reviewSummary__muted">
                    Contact: {draft.contact.email || "—"} · {draft.contact.phone || "—"}
                </p>
            </section>

            <section className="reviewSummary__section">
                <h4>Add-ons</h4>
                {draft.addons.every((a) => !a.meal && !a.baggage && !a.seat) ? (
                    <p className="reviewSummary__muted">No add-ons selected</p>
                ) : (
                    draft.addons.map((a, i) => {
                        const parts = [a.meal?.label, a.baggage?.label, a.seat?.label].filter(Boolean);
                        if (parts.length === 0) return null;
                        return (
                            <p key={a.travellerId}>
                                Traveller {i + 1}: {parts.join(", ")}
                            </p>
                        );
                    })
                )}
            </section>

            <section className="reviewSummary__section">
                <h4>Trip Protect</h4>
                <p>{draft.insurance.opted ? `Added — ₹${draft.insurance.planPrice}/traveller` : "Not added"}</p>
            </section>
        </div>
    );
}