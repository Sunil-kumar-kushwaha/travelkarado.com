"use client";

// ============================================================
// FRONTEND FILE (Next.js / React)
// Project path: components/flight/booking/InsuranceSection/InsuranceSection.tsx
// ============================================================

import { InsuranceSelection } from "@/types/booking.types";
import "./InsuranceSection.css";

interface InsuranceSectionProps {
    insurance: InsuranceSelection;
    onChange: (insurance: InsuranceSelection) => void;
}

const ORIGINAL_PRICE = 199;

export default function InsuranceSection({ insurance, onChange }: InsuranceSectionProps) {
    return (
        <div className="insuranceSection">
            <div className="insuranceSection__header">
                <span className="insuranceSection__icon">🛡️</span>
                <h3>Secure your trip with Trip Protect</h3>
            </div>

            <div className="insuranceSection__price">
                <span className="insuranceSection__priceNow">₹{insurance.planPrice}</span>
                <span className="insuranceSection__priceWas">₹{ORIGINAL_PRICE}</span>
            </div>

            <div className="insuranceSection__benefits">
                <span>✅ 24×7 Emergency Assistance</span>
                <span>✈️ Flight Delay — up to ₹1,500</span>
                <span>🧳 Loss of Checked Baggage — up to ₹2,500</span>
            </div>

            <label className="insuranceSection__option">
                <input
                    type="radio"
                    name="tripProtect"
                    checked={insurance.opted}
                    onChange={() => onChange({ ...insurance, opted: true })}
                />
                Yes, secure my trip.
            </label>
            <label className="insuranceSection__option">
                <input
                    type="radio"
                    name="tripProtect"
                    checked={!insurance.opted}
                    onChange={() => onChange({ ...insurance, opted: false })}
                />
                No, I will continue without Trip Protect.
            </label>

            <p className="insuranceSection__disclaimer">
                Trip Protect is a non-refundable product. By selecting it, you confirm all travellers are Indian
                nationals and accept the Terms and Conditions.
            </p>
        </div>
    );
}