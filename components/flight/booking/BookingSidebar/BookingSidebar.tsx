"use client";



import { useEffect, useState } from "react";
import apiClient from "@/utils/ApiClient";
import { AppliedOffer, Offer, PriceBreakup } from "@/types/booking.types";
import "./BookingSidebar.css";

interface BookingSidebarProps {
    priceBreakup: PriceBreakup;
    passengers: number;
    appliedOffer: AppliedOffer | null;
    onApplyOffer: (offer: AppliedOffer | null) => void;
}

export default function BookingSidebar({ priceBreakup, passengers, appliedOffer, onApplyOffer }: BookingSidebarProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [couponInput, setCouponInput] = useState("");
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        apiClient
            .get<{ data: Offer[] }>("/api/offers", {})
            .then((res) => setOffers(res.data))
            .catch(() => setOffers([]));
    }, []);

    const handleApply = async (code: string) => {
        if (!code.trim()) return;
        setApplying(true);
        setError("");
        try {
            const result = await apiClient.post<{ data: AppliedOffer }>("/api/offers/apply", {
                code,
                baseAmount: priceBreakup.baseFare + priceBreakup.taxes,
            });
            onApplyOffer(result.data);
            setCouponInput("");
        } catch (err) {
            const apiErr = err as InstanceType<typeof apiClient.ApiError>;
            setError((apiErr.data as { message?: string })?.message || "Could not apply this code");
        } finally {
            setApplying(false);
        }
    };

    // best applicable flat offer, just to show the "WOW price" teaser
    const bestApplicable = offers.filter((o) => o.applicable).sort((a, b) => b.discount - a.discount)[0];
    const wowPrice = bestApplicable ? Math.max(0, priceBreakup.totalPrice - bestApplicable.discount) : priceBreakup.totalPrice;

    return (
        <aside className="bookingSidebar">
            <div className="bookingSidebar__priceCard">
                <div className="bookingSidebar__totalRow">
                    <span>Total Price</span>
                    <span className="bookingSidebar__totalAmount">₹{priceBreakup.totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className="bookingSidebar__passengers">
                    {passengers} Traveller{passengers > 1 ? "s" : ""}
                </p>

                <div className="bookingSidebar__row">
                    <span>Base Fare</span>
                    <span>₹{priceBreakup.baseFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="bookingSidebar__row">
                    <span>Taxes &amp; fees</span>
                    <span>₹{priceBreakup.taxes.toLocaleString("en-IN")}</span>
                </div>
                {priceBreakup.addonsTotal > 0 && (
                    <div className="bookingSidebar__row">
                        <span>Add-ons</span>
                        <span>₹{priceBreakup.addonsTotal.toLocaleString("en-IN")}</span>
                    </div>
                )}
                {priceBreakup.insuranceTotal > 0 && (
                    <div className="bookingSidebar__row">
                        <span>Trip Protect</span>
                        <span>₹{priceBreakup.insuranceTotal.toLocaleString("en-IN")}</span>
                    </div>
                )}
                {priceBreakup.discount > 0 && (
                    <div className="bookingSidebar__row bookingSidebar__row--discount">
                        <span>Discount ({appliedOffer?.code})</span>
                        <span>-₹{priceBreakup.discount.toLocaleString("en-IN")}</span>
                    </div>
                )}
            </div>

            {!appliedOffer && bestApplicable && (
                <div className="bookingSidebar__wow">
                    <span className="bookingSidebar__wowBadge">WOW!</span>
                    <p>
                        Get for as low as <strong>₹{wowPrice.toLocaleString("en-IN")}</strong>
                    </p>
                </div>
            )}

            <div className="bookingSidebar__offers">
                <h4>Coupons / gift card</h4>
                <div className="bookingSidebar__couponRow">
                    <input
                        type="text"
                        placeholder="Coupon/Gift card"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button onClick={() => handleApply(couponInput)} disabled={applying}>
                        Apply
                    </button>
                </div>
                {error && <p className="bookingSidebar__error">{error}</p>}

                {appliedOffer ? (
                    <div className="bookingSidebar__appliedOffer">
                        <span>
                            <strong>{appliedOffer.code}</strong> applied — saved ₹{appliedOffer.discount}
                        </span>
                        <button onClick={() => onApplyOffer(null)}>Remove</button>
                    </div>
                ) : (
                    offers.map((offer) => (
                        <div key={offer.code} className="bookingSidebar__offerCard">
                            <div className="bookingSidebar__offerHeader">
                                <span className="bookingSidebar__offerCode">{offer.code}</span>
                                <button onClick={() => handleApply(offer.code)} disabled={applying || !offer.applicable}>
                                    Apply
                                </button>
                            </div>
                            <p className="bookingSidebar__offerAmount">
                                ₹{offer.discount} off {!offer.applicable && <span className="bookingSidebar__offerNote">(payment page only)</span>}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}