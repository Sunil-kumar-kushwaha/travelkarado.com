"use client";


import { AddonOption, AddonSelection, TravellerDetails } from "@/types/booking.types";
import "./AddonSection.css";

interface AddonsSectionProps {
    travellers: TravellerDetails[];
    addons: AddonSelection[];
    onChange: (addons: AddonSelection[]) => void;
}


const MEAL_OPTIONS: AddonOption[] = [
    { code: "veg", label: "Veg Meal", price: 150 },
    { code: "nonveg", label: "Non-Veg Meal", price: 180 },
];
const BAGGAGE_OPTIONS: AddonOption[] = [
    { code: "5kg", label: "+5 kg check-in", price: 500 },
    { code: "10kg", label: "+10 kg check-in", price: 900 },
];
const SEAT_OPTIONS: AddonOption[] = [
    { code: "standard", label: "Standard seat", price: 200 },
    { code: "legroom", label: "Extra legroom", price: 450 },
];

function findOption(list: AddonOption[], code: string | undefined): AddonOption | null {
    return list.find((o) => o.code === code) || null;
}

export default function AddonsSection({ travellers, addons, onChange }: AddonsSectionProps) {
    const updateFor = (travellerId: string, field: "meal" | "baggage" | "seat", option: AddonOption | null) => {
        onChange(addons.map((a) => (a.travellerId === travellerId ? { ...a, [field]: option } : a)));
    };

    return (
        <div className="addonsSection">
            <div className="addonsSection__header">
                <h3>Add-ons</h3>
            </div>

            {travellers.map((traveller, i) => {
                const selection = addons.find((a) => a.travellerId === traveller.id);
                return (
                    <div key={traveller.id} className="addonsSection__row">
                        <span className="addonsSection__travellerLabel">
                            {traveller.firstName || `Traveller ${i + 1}`}
                        </span>

                        <select
                            value={selection?.meal?.code || ""}
                            onChange={(e) => updateFor(traveller.id, "meal", findOption(MEAL_OPTIONS, e.target.value))}
                        >
                            <option value="">No meal</option>
                            {MEAL_OPTIONS.map((o) => (
                                <option key={o.code} value={o.code}>
                                    {o.label} (+₹{o.price})
                                </option>
                            ))}
                        </select>

                        <select
                            value={selection?.baggage?.code || ""}
                            onChange={(e) => updateFor(traveller.id, "baggage", findOption(BAGGAGE_OPTIONS, e.target.value))}
                        >
                            <option value="">No extra baggage</option>
                            {BAGGAGE_OPTIONS.map((o) => (
                                <option key={o.code} value={o.code}>
                                    {o.label} (+₹{o.price})
                                </option>
                            ))}
                        </select>

                        <select
                            value={selection?.seat?.code || ""}
                            onChange={(e) => updateFor(traveller.id, "seat", findOption(SEAT_OPTIONS, e.target.value))}
                        >
                            <option value="">No seat selection</option>
                            {SEAT_OPTIONS.map((o) => (
                                <option key={o.code} value={o.code}>
                                    {o.label} (+₹{o.price})
                                </option>
                            ))}
                        </select>
                    </div>
                );
            })}
        </div>
    );
}