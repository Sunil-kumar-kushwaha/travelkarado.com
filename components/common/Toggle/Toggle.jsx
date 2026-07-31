"use client";
import "./Toggle.css";

export default function Toggle({ checked, onChange, label, disabled = false }) {
    return (
        <label className={`tk-toggle-wrapper ${disabled ? "tk-toggle-disabled" : ""}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="tk-toggle-input"
            />
            <span className="tk-toggle-track">
                <span className="tk-toggle-thumb" />
            </span>
            {label && <span className="tk-toggle-label">{label}</span>}
        </label>
    );
}