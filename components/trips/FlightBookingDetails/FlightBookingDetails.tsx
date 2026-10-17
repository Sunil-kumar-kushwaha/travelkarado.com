"use client";

import { FlightBookingDetail } from "@/types/trips.types";
import { STATUS_LABEL, formatDate, formatDateTime, formatINR, formatTime, maskPassport, stopsLabel } from "@/utils/tripFormat";
import "../trips.css";

export default function FlightBookingDetails({ booking }: { booking: FlightBookingDetail }) {
    const { flight, travellers, addons, insurance, contact, appliedOffer, priceBreakup: p } = booking;
    const addonByTraveller = new Map(addons.map((a) => [a.travellerId, a]));

    return (
        <div className="tripDetail">
            <header className="tripDetail__top">
                <div>
                    <h1 className="trips__title">
                        {flight.source} → {flight.destination}
                    </h1>
                    <p className="tripCard__meta">
                        Booking ID <strong>{booking.id.slice(0, 8).toUpperCase()}</strong> · Booked on{" "}
                        {formatDateTime(booking.createdAt)}
                    </p>
                </div>
                <span className={`tripStatus tripStatus--${booking.status}`}>{STATUS_LABEL[booking.status]}</span>
            </header>

            <div className="tripDetail__grid">
                <div className="tripDetail__main">
                    {/* flight */}
                    <section className="tripBox">
                        <h2>Flight</h2>
                        <p className="tripCard__meta">
                            {flight.airline} · {flight.flightNumber} · {flight.cabinClass} · {stopsLabel(flight.stops)}
                        </p>
                        <div className="tripFlight">
                            <div>
                                <p className="tripFlight__time">{formatTime(flight.departureTime)}</p>
                                <p className="tripFlight__city">{flight.source}</p>
                                <p className="tripCard__small">{formatDate(flight.departureTime)}</p>
                            </div>
                            <div className="tripFlight__mid">
                                <p className="tripCard__small">{flight.duration}</p>
                                <div className="tripFlight__line" />
                            </div>
                            <div>
                                <p className="tripFlight__time">{formatTime(flight.arrivalTime)}</p>
                                <p className="tripFlight__city">{flight.destination}</p>
                                <p className="tripCard__small">{formatDate(flight.arrivalTime)}</p>
                            </div>
                        </div>
                    </section>

                    {/* travellers */}
                    <section className="tripBox">
                        <h2>Travellers ({booking.passengers})</h2>
                        {travellers.map((t, i) => (
                            <div className="tripRow" key={t.id}>
                                <div>
                                    <p className="tripRow__name">
                                        {i + 1}. {t.firstName} {t.lastName}
                                        {t.isPrimary && <span className="tripTag">Primary</span>}
                                    </p>
                                    <p className="tripCard__small">
                                        {t.type[0].toUpperCase() + t.type.slice(1)} · {t.gender}
                                    </p>
                                </div>
                                {t.passport && (
                                    <div className="tripRow__right">
                                        <p className="tripCard__small">Passport {maskPassport(t.passport.number)}</p>
                                        <p className="tripCard__small">
                                            {t.passport.nationality} · expires {t.passport.expiryDate}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    {/* add-ons / amenities */}
                    <section className="tripBox">
                        <h2>Add-ons & amenities</h2>
                        {travellers.map((t) => {
                            const a = addonByTraveller.get(t.id);
                            const items: [string, { label: string; price: number } | null | undefined][] = [
                                ["Meal", a?.meal],
                                ["Baggage", a?.baggage],
                                ["Seat", a?.seat],
                            ];
                            const chosen = items.filter(([, v]) => v);
                            return (
                                <div className="tripRow tripRow--col" key={t.id}>
                                    <p className="tripRow__name">{t.firstName} {t.lastName}</p>
                                    {chosen.length === 0 ? (
                                        <p className="tripCard__small">No add-ons selected</p>
                                    ) : (
                                        chosen.map(([label, v]) => (
                                            <p className="tripLine" key={label}>
                                                <span>{label}: {v!.label}</span>
                                                <span>{v!.price ? formatINR(v!.price) : "Free"}</span>
                                            </p>
                                        ))
                                    )}
                                </div>
                            );
                        })}
                        <div className="tripRow tripRow--col">
                            <p className="tripRow__name">Trip insurance</p>
                            <p className="tripCard__small">
                                {insurance.opted ? `Added · ${formatINR(insurance.planPrice)} per traveller` : "Not added"}
                            </p>
                        </div>
                    </section>

                    {/* contact */}
                    <section className="tripBox">
                        <h2>Contact details</h2>
                        <p className="tripLine"><span>Email</span><span>{contact.email}</span></p>
                        <p className="tripLine"><span>Phone</span><span>{contact.phone}</span></p>
                    </section>
                </div>

                {/* price breakup */}
                <aside className="tripBox tripPrice">
                    <h2>Price details</h2>
                    <p className="tripLine"><span>Base fare</span><span>{formatINR(p.baseFare)}</span></p>
                    <p className="tripLine"><span>Taxes & fees</span><span>{formatINR(p.taxes)}</span></p>
                    {p.addonsTotal > 0 && <p className="tripLine"><span>Add-ons</span><span>{formatINR(p.addonsTotal)}</span></p>}
                    {p.insuranceTotal > 0 && <p className="tripLine"><span>Insurance</span><span>{formatINR(p.insuranceTotal)}</span></p>}
                    {p.discount > 0 && (
                        <p className="tripLine tripLine--green">
                            <span>Discount{appliedOffer ? ` (${appliedOffer.code})` : ""}</span>
                            <span>− {formatINR(p.discount)}</span>
                        </p>
                    )}
                    <p className="tripLine tripLine--total"><span>Total paid</span><span>{formatINR(p.totalPrice)}</span></p>
                    {booking.paymentRef && <p className="tripCard__small">Payment ref: {booking.paymentRef}</p>}
                </aside>
            </div>
        </div>
    );
}