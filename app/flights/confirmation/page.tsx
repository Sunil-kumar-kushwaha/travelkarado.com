"use client";



import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./confirmation.css";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const paymentRef = searchParams.get("paymentRef") || "";

    return (
        <div className="confirmationPage">
            <div className="confirmationPage__card">
                <div className="confirmationPage__icon">✅</div>
                <h1>Booking confirmed!</h1>
                <p>Your payment was successful and your e-ticket will be emailed to you shortly.</p>

                {paymentRef && (
                    <div className="confirmationPage__ref">
                        <span>Payment reference</span>
                        <strong>{paymentRef}</strong>
                    </div>
                )}

                <Link href="/" className="confirmationPage__homeLink">
                    Back to home
                </Link>
            </div>
        </div>
    );
}


export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="confirmationPage">Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}