"use client";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./OffersCard.css";

/**
 * offers: [{ title, description, cta, link, href }]
 */
export default function OffersCard({ offers, onViewAll }) {
    const [index, setIndex] = useState(0);
    if (!offers || offers.length === 0) return null;
    const offer = offers[index];

    const goPrev = () => setIndex((i) => (i - 1 + offers.length) % offers.length);
    const goNext = () => setIndex((i) => (i + 1) % offers.length);

    return (
        <div className="tk-offers">
            <div className="tk-offers-header">
                <h4>More offers</h4>
                <button type="button" className="tk-offers-viewall" onClick={onViewAll}>
                    View all
                </button>
            </div>

            <div className="tk-offers-card">
                <h5>{offer.title}</h5>
                <p>{offer.description}</p>
                {offer.cta && <span className="tk-offers-cta">{offer.cta}</span>}
                {offer.link && (
                    <a href={offer.href || "#"} className="tk-offers-link">
                        {offer.link}
                    </a>
                )}
            </div>

            {offers.length > 1 && (
                <div className="tk-offers-nav">
                    <button onClick={goPrev} aria-label="Previous offer" className="tk-offers-nav-btn">
                        <MdChevronLeft />
                    </button>
                    <span className="tk-offers-nav-dot" />
                    <button onClick={goNext} aria-label="Next offer" className="tk-offers-nav-btn">
                        <MdChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}