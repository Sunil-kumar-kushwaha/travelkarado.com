"use client";


import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "@/utils/ApiClient";
import { useDebounce } from "@/hooks/useDebounce";
import "./AirportAutocomplete.css";

export interface Airport {
    code: string; // IATA code, e.g. "DEL"
    name: string; // e.g. "Delhi,Delhi" (as returned by the API)
    city: string; // e.g. "Delhi"
    country: string; // e.g. "India"
    countryCode: string; // e.g. "in" — handy for a flag icon if you want one
}

interface AirportAutocompleteProps {
    label?: string;
    placeholder?: string;
    onSelect: (airport: Airport) => void;
    /** Prevents selecting the same airport already chosen in the paired field (e.g. "From" excludes "To"). */
    excludeCode?: string;
}

const MIN_CHARS = 2;

export default function AirportAutocomplete({
    label,
    placeholder = "Where from?",
    onSelect,
    excludeCode,
}: AirportAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    const debouncedQuery = useDebounce(query, 300);
    const abortRef = useRef<AbortController | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // close the dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const fetchSuggestions = useCallback(
        async (term: string) => {
            // cancel any in-flight request for the previous keystroke — otherwise
            // a slow response for "de" can land after a faster one for "del" and
            // overwrite the correct, newer results.
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError("");
            try {
                const data = await apiClient.get<{ data: Airport[] }>(
                    "/api/flights/airports-auto",
                    { keyword: term }, // adjust the param name to match your backend's actual query key
                    { signal: controller.signal }
                );

                let results = data?.data || [];
                if (excludeCode) {
                    results = results.filter((a) => a.code !== excludeCode);
                }

                setSuggestions(results);
                setIsOpen(true);
                setActiveIndex(-1);
            } catch (err) {
                if ((err as Error).name === "AbortError") return; // expected, ignore
                setError("Could not load airports");
                setSuggestions([]);
                setIsOpen(true);
            } finally {
                setLoading(false);
            }
        },
        [excludeCode]
    );

    useEffect(() => {
        const term = debouncedQuery.trim();
        if (term.length < MIN_CHARS) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }
        fetchSuggestions(term);
    }, [debouncedQuery, fetchSuggestions]);

    const handleSelect = (airport: Airport) => {
        onSelect(airport);
        setQuery(`${airport.city} (${airport.code})`);
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0) handleSelect(suggestions[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div className="airportAutocomplete" ref={containerRef}>
            {label && <label className="airportAutocomplete__label">{label}</label>}

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="airportAutocomplete__input"
                autoComplete="off"
                role="combobox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
            />

            {isOpen && (
                <ul className="airportAutocomplete__dropdown" role="listbox">
                    {loading && <li className="airportAutocomplete__status">Searching...</li>}

                    {!loading && error && (
                        <li className="airportAutocomplete__status airportAutocomplete__status--error">{error}</li>
                    )}

                    {!loading && !error && suggestions.length === 0 && (
                        <li className="airportAutocomplete__status">No airports found</li>
                    )}

                    {!loading &&
                        !error &&
                        suggestions.map((airport, index) => (
                            <li
                                key={airport.code}
                                role="option"
                                aria-selected={index === activeIndex}
                                className={`airportAutocomplete__item${index === activeIndex ? " airportAutocomplete__item--active" : ""
                                    }`}
                                // onMouseDown (not onClick) fires before the input's onBlur/dropdown-close logic
                                onMouseDown={() => handleSelect(airport)}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <span className="airportAutocomplete__code">{airport.code}</span>
                                <span className="airportAutocomplete__details">
                                    <span className="airportAutocomplete__city">
                                        {airport.city}, {airport.country}
                                    </span>
                                    <span className="airportAutocomplete__name">{airport.name}</span>
                                </span>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}