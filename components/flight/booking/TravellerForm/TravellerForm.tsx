"use client";



import { useState } from "react";
import { TravellerDetails } from "@/types/booking.types";
import "./TravellerForm.css";

interface TravellerFormProps {
    travellers: TravellerDetails[];
    isInternational: boolean;
    contact: { email: string; phone: string };
    onTravellersChange: (travellers: TravellerDetails[]) => void;
    onContactChange: (contact: { email: string; phone: string }) => void;
}

export default function TravellerForm({
    travellers,
    isInternational,
    contact,
    onTravellersChange,
    onContactChange,
}: TravellerFormProps) {
    const [gstin, setGstin] = useState("");
    const [companyName, setCompanyName] = useState("");

    const updateTraveller = (id: string, patch: Partial<TravellerDetails>) => {
        onTravellersChange(travellers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    };

    const updatePassport = (id: string, patch: Partial<NonNullable<TravellerDetails["passport"]>>) => {
        const traveller = travellers.find((t) => t.id === id);
        const current = traveller?.passport || { number: "", expiryDate: "", nationality: "" };
        updateTraveller(id, { passport: { ...current, ...patch } });
    };

    return (
        <div className="travellerForm">
            <div className="travellerForm__contact">
                <label>Contact details</label>
                <div className="travellerForm__contactRow">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={contact.email}
                        onChange={(e) => onContactChange({ ...contact, email: e.target.value })}
                    />
                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={contact.phone}
                        onChange={(e) => onContactChange({ ...contact, phone: e.target.value })}
                    />
                </div>
                <p className="travellerForm__hint">E-ticket will be sent here.</p>
            </div>

            <h3 className="travellerForm__heading">Add traveller details</h3>

            {travellers.map((traveller, i) => (
                <div key={traveller.id} className="travellerForm__card">
                    <p className="travellerForm__travellerTitle">
                        {traveller.type === "adult" ? "Adult" : traveller.type === "child" ? "Child" : "Infant"} {i + 1}
                        {traveller.isPrimary && <span className="travellerForm__primaryTag"> (Primary traveller)</span>}
                    </p>

                    <label className="travellerForm__label">Traveller name</label>
                    <div className="travellerForm__genderRow">
                        <button
                            type="button"
                            className={`travellerForm__pill${traveller.gender === "Male" ? " travellerForm__pill--active" : ""}`}
                            onClick={() => updateTraveller(traveller.id, { gender: "Male" })}
                        >
                            Male
                        </button>
                        <button
                            type="button"
                            className={`travellerForm__pill${traveller.gender === "Female" ? " travellerForm__pill--active" : ""}`}
                            onClick={() => updateTraveller(traveller.id, { gender: "Female" })}
                        >
                            Female
                        </button>
                    </div>

                    <div className="travellerForm__nameRow">
                        <input
                            type="text"
                            placeholder="First name"
                            value={traveller.firstName}
                            onChange={(e) => updateTraveller(traveller.id, { firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={traveller.lastName}
                            onChange={(e) => updateTraveller(traveller.id, { lastName: e.target.value })}
                        />
                    </div>

                    {isInternational && (
                        <div className="travellerForm__passport">
                            <label className="travellerForm__label">Passport details</label>
                            <div className="travellerForm__passportRow">
                                <input
                                    type="text"
                                    placeholder="Passport number"
                                    value={traveller.passport?.number || ""}
                                    onChange={(e) => updatePassport(traveller.id, { number: e.target.value })}
                                />
                                <input
                                    type="date"
                                    placeholder="Expiry date"
                                    value={traveller.passport?.expiryDate || ""}
                                    onChange={(e) => updatePassport(traveller.id, { expiryDate: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Nationality"
                                    value={traveller.passport?.nationality || ""}
                                    onChange={(e) => updatePassport(traveller.id, { nationality: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {traveller.isPrimary && (
                        <div className="travellerForm__gst">
                            <label className="travellerForm__label">GST number (optional)</label>
                            <p className="travellerForm__hint">Use your GSTIN to avail GST benefits &amp; additional savings.</p>
                            <div className="travellerForm__gstRow">
                                <input
                                    type="text"
                                    placeholder="Enter your GSTIN"
                                    value={gstin}
                                    onChange={(e) => setGstin(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}