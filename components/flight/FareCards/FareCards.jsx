"use client";
import Button from "@/components/common/Button/Button";
import "./FareCards.css";

const FARE_TYPES = [
    { id: "student", label: "Student", note: "Extra baggage, discounts" },
    { id: "senior", label: "Senior citizen", note: "Up to ₹600 off" },
    { id: "armed", label: "Armed forces", note: "Up to ₹600 off" },
];

/**
 * selectedFares: Set of fare-type ids ("student" | "senior" | "armed")
 * onToggleFare: (nextSet) => void
 * businessFares: boolean
 * onToggleBusiness: (checked) => void
 */
export default function FareCards({ selectedFares, onToggleFare, businessFares, onToggleBusiness }) {
    const toggleFare = (id) => {
        const next = new Set(selectedFares);
        next.has(id) ? next.delete(id) : next.add(id);
        onToggleFare(next);
    };

    return (
        <div className="tk-farecards-row">
            <label className="tk-farecard-business">
                <input type="checkbox" checked={businessFares} onChange={(e) => onToggleBusiness(e.target.checked)} />
                <span className="tk-farecard-checkbox" />
                <span className="tk-farecard-business-text">
                    <span className="tk-farecard-business-title">Business Fares by Cleartrip</span>
                    <span className="tk-farecard-business-sub">Unlock 10% extra savings</span>
                </span>
                <Button text="Save More" variant="primary" className="tk-farecard-save-btn" />
            </label>

            <div className="tk-farecard-divider" />

            <div className="tk-farecard-chip-row">
                {FARE_TYPES.map((f) => {
                    const active = selectedFares.has(f.id);
                    return (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => toggleFare(f.id)}
                            className={`tk-farecard-chip ${active ? "tk-farecard-chip-active" : ""}`}
                        >
                            <span className="tk-farecard-chip-title">{f.label}</span>
                            <span className="tk-farecard-chip-sub">{f.note}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}