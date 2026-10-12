"use client";



import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/ApiClient";
import { useBooking } from "@/context/BookingContext";
import { computePriceBreakup } from "@/utils/priceBreakup";
import FlightSummaryCard from "@/components/flight/booking/FlightSummaryCard/FlightSummaryCard";
import InsuranceSection from "@/components/flight/booking/InsuranceSection/InsuranceSection";
import AddonsSection from "@/components/flight/booking/AddonsSection/AddonsSection";
import TravellerForm from "@/components/flight/booking/TravellerForm/TravellerForm";
import BookingSidebar from "@/components/flight/booking/BookingSidebar/BookingSidebar";
import ReviewSummary from "@/components/flight/booking/ReviewSummary/ReviewSummary";
import Navbar from "@/components/layout/Navbar/Navbar";
import "./book.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/footer/Footer";

export default function BookingDetailsPage() {
    const router = useRouter();
    const { draft, updateTravellers, updateAddons, updateInsurance, updateContact, applyOffer } = useBooking();
    const [step, setStep] = useState<"details" | "review">("details");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const priceBreakup = useMemo(() => {
        if (!draft) return null;
        return computePriceBreakup(draft.flight, draft.passengers, draft.addons, draft.insurance, draft.appliedOffer);
    }, [draft]);

    if (!draft || !priceBreakup) {
        return (
            <div className="bookPage__status">
                No flight selected. Please go back and pick a flight from the results page.
            </div>
        );
    }

    const validateDetails = (): string => {
        for (const t of draft.travellers) {
            if (!t.firstName.trim() || !t.lastName.trim()) return "Please fill in every traveller's first and last name.";
            if (draft.isInternational && (!t.passport?.number || !t.passport?.expiryDate || !t.passport?.nationality)) {
                return "Passport details are required for every traveller on an international flight.";
            }
        }
        if (!draft.contact.email.trim() || !draft.contact.phone.trim()) {
            return "Please provide a contact email and phone number.";
        }
        return "";
    };

    const handleContinue = () => {
        const validationError = validateDetails();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");
        setStep("review");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleProceedToPayment = async () => {
        setSubmitting(true);
        setError("");
        try {
            const result = await apiClient.post<{ data: { id: string } }>("/api/bookings", {
                ...draft,
                priceBreakup,
            });
            router.push(`/flights/payment?bookingId=${result.data.id}`);
        } catch {
            setError("Could not create your booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bookPage_flt">
            <Header />
            <Navbar products={"flights"} />

            <div className="bookPage">
                <div className="bookPage__main">
                    <FlightSummaryCard flight={draft.flight} passengers={draft.passengers} />

                    {step === "details" ? (
                        <>
                            <InsuranceSection insurance={draft.insurance} onChange={updateInsurance} />
                            <AddonsSection travellers={draft.travellers} addons={draft.addons} onChange={updateAddons} />
                            <TravellerForm
                                travellers={draft.travellers}
                                isInternational={draft.isInternational}
                                contact={draft.contact}
                                onTravellersChange={updateTravellers}
                                onContactChange={updateContact}
                            />

                            {error && <p className="bookPage__error">{error}</p>}

                            <button className="bookPage__continueBtn" onClick={handleContinue}>
                                Continue to payment
                            </button>
                        </>
                    ) : (
                        <>
                            <ReviewSummary draft={draft} onEdit={() => setStep("details")} />

                            {error && <p className="bookPage__error">{error}</p>}

                            <button className="bookPage__continueBtn" onClick={handleProceedToPayment} disabled={submitting}>
                                {submitting ? "Creating booking..." : "Proceed to payment"}
                            </button>
                        </>
                    )}
                </div>

                <BookingSidebar
                    priceBreakup={priceBreakup}
                    passengers={draft.passengers}
                    appliedOffer={draft.appliedOffer}
                    onApplyOffer={applyOffer}
                />
            </div>
            <Footer />
        </div>

    );
}