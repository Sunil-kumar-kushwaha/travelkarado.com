"use client";



import { useState } from "react";
import "./PaymentMethodSelector.css";

export type PaymentMethod = "card" | "upi" | "paylater" | "wallet";

interface PaymentMethodSelectorProps {
    onPay: (method: PaymentMethod, details: Record<string, string>) => void;
    submitting: boolean;
}

const METHODS: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: "Credit / Debit Card" },
    { id: "upi", label: "UPI" },
    { id: "paylater", label: "Pay Later" },
    { id: "wallet", label: "Wallet" },
];

export default function PaymentMethodSelector({ onPay, submitting }: PaymentMethodSelectorProps) {
    const [active, setActive] = useState<PaymentMethod>("card");

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [upiId, setUpiId] = useState("");
    const [wallet, setWallet] = useState("paytm");

    const handleSubmit = () => {
        if (active === "card") {
            onPay("card", { cardNumber, cardName, cardExpiry, cardCvv });
        } else if (active === "upi") {
            onPay("upi", { upiId });
        } else if (active === "paylater") {
            onPay("paylater", {});
        } else {
            onPay("wallet", { wallet });
        }
    };

    const isValid =
        (active === "card" && cardNumber.trim() && cardName.trim() && cardExpiry.trim() && cardCvv.trim()) ||
        (active === "upi" && upiId.trim().includes("@")) ||
        active === "paylater" ||
        (active === "wallet" && wallet);

    return (
        <div className="paymentMethod">
            <div className="paymentMethod__tabs">
                {METHODS.map((m) => (
                    <button
                        key={m.id}
                        className={`paymentMethod__tab${active === m.id ? " paymentMethod__tab--active" : ""}`}
                        onClick={() => setActive(m.id)}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="paymentMethod__form">
                {active === "card" && (
                    <div className="paymentMethod__fields">
                        <input
                            type="text"
                            placeholder="Card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength={19}
                        />
                        <input
                            type="text"
                            placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                        />
                        <div className="paymentMethod__row">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                maxLength={5}
                            />
                            <input
                                type="password"
                                placeholder="CVV"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                maxLength={4}
                            />
                        </div>
                    </div>
                )}

                {active === "upi" && (
                    <div className="paymentMethod__fields">
                        <input
                            type="text"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                    </div>
                )}

                {active === "paylater" && (
                    <p className="paymentMethod__note">
                        You&apos;ll be redirected to your Pay Later provider to complete this booking.
                    </p>
                )}

                {active === "wallet" && (
                    <select value={wallet} onChange={(e) => setWallet(e.target.value)}>
                        <option value="paytm">Paytm</option>
                        <option value="phonepe">PhonePe</option>
                        <option value="amazonpay">Amazon Pay</option>
                    </select>
                )}
            </div>

            <button className="paymentMethod__payBtn" onClick={handleSubmit} disabled={!isValid || submitting}>
                {submitting ? "Processing payment..." : "Pay now"}
            </button>
        </div>
    );
}