"use client";
import "./TripType.css";

const DEFAULT_OPTIONS = [
    { value: "oneway", label: "One Way" },
    { value: "roundtrip", label: "Round Trip" },
    { value: "multicity", label: "Multi City" },
];

export default function TripType({ selected, onChange, options = DEFAULT_OPTIONS, compact = false }) {
    return (
        <div className={`tk-triptype ${compact ? "tk-triptype-compact" : ""}`}>
            {options.map((opt) => (
                <label key={opt.value} className="tk-triptype-option">
                    <input
                        type="radio"
                        name="tripType"
                        value={opt.value}
                        checked={selected === opt.value}
                        onChange={() => onChange(opt.value)}
                    />
                    <span className="tk-triptype-radio" />
                    <span className="tk-triptype-label">{opt.label}</span>
                </label>
            ))}
        </div>
    );
}