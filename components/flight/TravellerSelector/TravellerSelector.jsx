"use client";
import { useState, useRef, useEffect } from "react";
import { MdPerson, MdKeyboardArrowDown } from "react-icons/md";
import "./TravellerSelector.css";

const CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];

function Counter({ label, sublabel, value, min = 0, max = 9, onChange }) {
    return (
        <div className="tk-traveller-counter-row">
            <div>
                <div className="tk-traveller-counter-label">{label}</div>
                {sublabel && <div className="tk-traveller-counter-sublabel">{sublabel}</div>}
            </div>
            <div className="tk-traveller-counter-controls">
                <button
                    type="button"
                    disabled={value <= min}
                    onClick={() => onChange(value - 1)}
                    className="tk-traveller-counter-btn"
                    aria-label={`Decrease ${label}`}
                >
                    −
                </button>
                <span className="tk-traveller-counter-value">{value}</span>
                <button
                    type="button"
                    disabled={value >= max}
                    onClick={() => onChange(value + 1)}
                    className="tk-traveller-counter-btn"
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

/**
 * value shape: { adults, children, infants, travelClass }
 * onChange receives the full updated object.
 */
export default function TravellerSelector({ value, onChange }) {
    const { adults, children, infants, travelClass } = value;
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const total = adults + children + infants;
    const summary = `${total} ${total === 1 ? "Traveller" : "Travellers"}, ${travelClass}`;

    return (
        <div className="tk-traveller-selector" ref={containerRef}>
            <button type="button" className="tk-traveller-trigger" onClick={() => setOpen((o) => !o)}>
                <MdPerson className="tk-traveller-trigger-icon" />
                <span className="tk-traveller-trigger-text">{summary}</span>
                <MdKeyboardArrowDown className={`tk-traveller-trigger-chevron ${open ? "tk-traveller-open" : ""}`} />
            </button>

            {open && (
                <div className="tk-traveller-panel">
                    <Counter
                        label="Adults"
                        sublabel="12yrs & above"
                        value={adults}
                        min={1}
                        onChange={(v) => onChange({ ...value, adults: v, infants: Math.min(infants, v) })}
                    />
                    <Counter
                        label="Children"
                        sublabel="2yrs - 12yrs"
                        value={children}
                        onChange={(v) => onChange({ ...value, children: v })}
                    />
                    <Counter
                        label="Infants"
                        sublabel="Below 2 yrs"
                        value={infants}
                        max={adults}
                        onChange={(v) => onChange({ ...value, infants: v })}
                    />

                    <div className="tk-traveller-classes">
                        {CLASSES.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`tk-traveller-class-chip ${travelClass === c ? "tk-traveller-class-active" : ""}`}
                                onClick={() => onChange({ ...value, travelClass: c })}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <button type="button" className="tk-traveller-apply" onClick={() => setOpen(false)}>
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}