"use client";


import { Suspense } from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/utils/ApiClient";
import { useBooking } from "@/context/BookingContext";
import { computePriceBreakup } from "@/utils/priceBreakup";
import BookingSidebar from "@/components/flight/booking/BookingSidebar/BookingSidebar";
import PaymentMethodSelector, { PaymentMethod } from "@/components/flight/payment/PaymentMethodSelector/PaymentMethodSelector";
import "./payment.css";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId") || "";

    const { draft, applyOffer, clear } = useBooking();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const priceBreakup = useMemo(() => {
        if (!draft) return null;
        return computePriceBreakup(draft.flight, draft.passengers, draft.addons, draft.insurance, draft.appliedOffer);
    }, [draft]);

    if (!draft || !priceBreakup || !bookingId) {
        return <div className="paymentPage__status">Missing booking details. Please start your booking again.</div>;
    }

    const handlePay = async (method: PaymentMethod, details: Record<string, string>) => {
        setSubmitting(true);
        setError("");
        try {
            const result = await apiClient.post<{ data: { paymentRef: string } }>("/api/payments/pay", {
                bookingId,
                method,
                amount: priceBreakup.totalPrice,
                details,
            });
            clear(); 
            router.push(`/flights/confirmation?paymentRef=${result.data.paymentRef}`);
        } catch (err) {
            const apiErr = err as InstanceType<typeof apiClient.ApiError>;
            setError((apiErr.data as { message?: string })?.message || "Payment failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="paymentPage">
            <div className="paymentPage__main">
                <h2 className="paymentPage__heading">Choose payment method</h2>
                {error && <p className="paymentPage__error">{error}</p>}
                <PaymentMethodSelector onPay={handlePay} submitting={submitting} />
            </div>

            <BookingSidebar
                priceBreakup={priceBreakup}
                passengers={draft.passengers}
                appliedOffer={draft.appliedOffer}
                onApplyOffer={applyOffer}
            />
        </div>
    );
}


export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="paymentPage__status">Loading payment details...</div>}>
            <PaymentContent />
        </Suspense>
    );
}