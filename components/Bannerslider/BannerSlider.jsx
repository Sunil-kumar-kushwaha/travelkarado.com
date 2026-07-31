"use client";
import { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./BannerSlider.css";

/**
 * slides: [{ image, code, badge, title, subtitle }]
 */
export default function BannerSlider({ slides, autoPlayMs = 4500 }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!autoPlayMs || !slides || slides.length < 2) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoPlayMs);
        return () => clearInterval(timer);
    }, [slides, autoPlayMs]);

    if (!slides || slides.length === 0) return null;
    const slide = slides[index];

    const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
    const goNext = () => setIndex((i) => (i + 1) % slides.length);

    return (
        <div className="tk-bannerslider" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="tk-bannerslider-overlay" />

            {slide.code && <span className="tk-bannerslider-code">{slide.code}</span>}
            {slide.badge && <span className="tk-bannerslider-badge">{slide.badge}</span>}

            <div className="tk-bannerslider-content">
                <h3>{slide.title}</h3>
                {slide.subtitle && <p>{slide.subtitle}</p>}
            </div>

            {slides.length > 1 && (
                <>
                    <button className="tk-bannerslider-nav tk-bannerslider-prev" onClick={goPrev} aria-label="Previous slide">
                        <MdChevronLeft />
                    </button>
                    <button className="tk-bannerslider-nav tk-bannerslider-next" onClick={goNext} aria-label="Next slide">
                        <MdChevronRight />
                    </button>

                    <div className="tk-bannerslider-dots">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={`tk-bannerslider-dot ${i === index ? "tk-bannerslider-dot-active" : ""}`}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}