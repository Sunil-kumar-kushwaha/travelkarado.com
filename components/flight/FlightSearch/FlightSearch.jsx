
"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from '@/utils/ApiClient';
import { MdFlightTakeoff, MdFlightLand, MdCalendarMonth, MdSwapHoriz } from "react-icons/md";
import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import Toggle from "@/components/common/Toggle/Toggle";
import CalendarModal from "@/components/common/Calendar/CalendarModal";
import TripType from "@/components/flight/TripType/TripType";
import TravellerSelector from "@/components/flight/TravellerSelector/TravellerSelector";
import FareCards from "@/components/flight/FareCards/FareCards";
import debounce from "@/utils/debounce";
import "./FlightSearch.css";

const TRIP_OPTIONS = [
    { value: "oneway", label: "One way" },
    { value: "roundtrip", label: "Round trip" },
];

const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
};


const toISODate = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
};

export default function FlightSearch() {
    const router = useRouter();

    const [flightAutoComplete, setFlightAutoComplete] = useState([]);
    const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);

    const [activeField, setActiveField] = useState(null);

    const [tripType, setTripType] = useState("oneway");
    const [from, setFrom] = useState("Delhi (DEL)");
    const [to, setTo] = useState("Mumbai (BOM)");

    const [fromAirport, setFromAirport] = useState(
        {
            "code": "DEL",
            "name": "Delhi,Delhi",
            "country": "India",
            "city": "Delhi",
            "countryCode": "in"
        }
    );
    const [toAirport, setToAirport] = useState(
        {
            "code": "BOM",
            "name": "Mumbai,Mumbai",
            "country": "India",
            "city": "Mumbai",
            "countryCode": "in"
        }
    );

    const [departDate, setDepartDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [returnDate, setReturnDate] = useState(null);
    const [activeCalendar, setActiveCalendar] = useState(null);

    const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0, travelClass: "Economy" });
    const [selectedFares, setSelectedFares] = useState(new Set());
    const [businessFares, setBusinessFares] = useState(false);
    const [nonStop, setNonStop] = useState(false);
    const [searchError, setSearchError] = useState("");

    const locRowRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (locRowRef.current && !locRowRef.current.contains(e.target)) {
                setActiveField(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSwap = () => {
        setFrom(to);
        setTo(from);
        setFromAirport(toAirport);
        setToAirport(fromAirport);
    };

    const callAutoCompleteApi = useCallback(async (value) => {
        if (value.trim().length < 2) {
            setFlightAutoComplete([]);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setAutoCompleteLoading(true);
        try {
            const data = await apiClient.get(
                'http://localhost:5050/api/flights/airports-auto',
                { countryCode: value },
                { headers: { Accept: 'application/json' }, signal: controller.signal }
            );
            setFlightAutoComplete(data.data || []);
        } catch (error) {
            if (error?.name === 'AbortError') return; // expected, ignore
            console.error('Airport autocomplete failed:', error);
            setFlightAutoComplete([]);
        } finally {
            setAutoCompleteLoading(false);
        }
    }, []);

    const debouncedAutoComplete = useMemo(() => debounce(callAutoCompleteApi, 500), [callAutoCompleteApi]);

    const handleFromAutoCompleteChange = (value) => {
        setFrom(value);
        setFromAirport(null);
        setActiveField("from");
        debouncedAutoComplete(value);
    };

    const handleToAutoCompleteChange = (value) => {
        setTo(value);
        setToAirport(null);
        setActiveField("to");
        debouncedAutoComplete(value);
    };

    const handleSelectAirport = (field, airport) => {
        const display = `${airport.city} (${airport.code})`;
        if (field === "from") {
            setFrom(display);
            setFromAirport(airport);
        } else {
            setTo(display);
            setToAirport(airport);
        }
        setActiveField(null);
        setFlightAutoComplete([]);
    };

    const handleDateSelect = (date) => {
        if (activeCalendar === "depart") {
            setDepartDate(date);
            if (returnDate && date > returnDate) setReturnDate(null);
        } else if (activeCalendar === "return") {
            setReturnDate(date);
        }
        setActiveCalendar(null);
    };

   
    const handleSearch = () => {
        if (!fromAirport || !toAirport) {
            setSearchError("Please select both origin and destination from the suggestions list.");
            return;
        }
        if (tripType === "roundtrip" && !returnDate) {
            setSearchError("Please select a return date for round trip.");
            return;
        }
        setSearchError("");

        const params = new URLSearchParams({
            tripType, // kept for the results-page recap header only — backend doesn't use it
            source: fromAirport.code,
            destination: toAirport.code,
            departureDate: toISODate(departDate),
            passengers: String(travellers.adults + travellers.children + travellers.infants),
            page: "1",
            limit: "15",
        });

        if (tripType === "roundtrip" && returnDate) {
            params.set("returnDate", toISODate(returnDate));
        }
        if (businessFares) {
            params.set("businessFares", "true");
        }
        if (selectedFares.size > 0) {
            params.set("fares", Array.from(selectedFares).join(","));
        }

        router.push(`/flights/results?${params.toString()}`);
    };

    const renderSuggestions = (field, excludeCode) => {
        if (activeField !== field) return null;

        const results = excludeCode
            ? flightAutoComplete.filter((a) => a.code !== excludeCode)
            : flightAutoComplete;

        const showDropdown = autoCompleteLoading || results.length > 0 || (field === "from" ? from : to).trim().length >= 2;
        if (!showDropdown) return null;

        return (
            <ul className="tk-suggest-dropdown">
                {autoCompleteLoading && <li className="tk-suggest-status">Searching...</li>}

                {!autoCompleteLoading && results.length === 0 && (
                    <li className="tk-suggest-status">No airports found</li>
                )}

                {!autoCompleteLoading &&
                    results.map((airport) => (
                        <li
                            key={airport.code}
                            className="tk-suggest-item"
                            onMouseDown={() => handleSelectAirport(field, airport)}
                        >
                            <span className="tk-suggest-code">{airport.code}</span>
                            <span className="tk-suggest-details">
                                <span className="tk-suggest-city">
                                    {airport.city}, {airport.country}
                                </span>
                                <span className="tk-suggest-name">{airport.name}</span>
                            </span>
                        </li>
                    ))}
            </ul>
        );
    };

    return (
        <div className="tk-flightsearch">

            <div className="tk-salebanner">
                <div className="tk-salebanner-text">
                    <h2>Save max on Flights!</h2>
                    <p>Up to 25% off | Flight from ₹1,799</p>
                </div>
                <div className="tk-salebanner-badge">
                    <span className="tk-salebanner-badge-title">Travel Max Sale</span>
                    <span className="tk-salebanner-badge-live">● LIVE NOW</span>
                </div>
            </div>

            <div className="tk-flightsearch-body">

                <div className="tk-flightsearch-toprow">
                    <TripType selected={tripType} onChange={setTripType} options={TRIP_OPTIONS} compact />
                    <div className="tk-flightsearch-divider-v" />
                    <TravellerSelector value={travellers} onChange={setTravellers} />
                </div>


                <div className="tk-flightsearch-locrow" ref={locRowRef}>
                    <div className="tk-loc-field">
                        <Input
                            icon={<MdFlightTakeoff />}
                            placeholder="Where from?"
                            value={from}
                            onChange={(e) => handleFromAutoCompleteChange(e.target.value)}
                            onFocus={() => from.trim().length >= 2 && setActiveField("from")}
                            className="tk-loc-input"
                            autoComplete="off"
                        />
                        {renderSuggestions("from", toAirport?.code)}
                    </div>

                    <button type="button" className="tk-swap-btn" onClick={handleSwap} aria-label="Swap origin and destination">
                        <MdSwapHoriz />
                    </button>

                    <div className="tk-loc-field">
                        <Input
                            icon={<MdFlightLand />}
                            placeholder="Where to?"
                            value={to}
                            onChange={(e) => handleToAutoCompleteChange(e.target.value)}
                            onFocus={() => to.trim().length >= 2 && setActiveField("to")}
                            className="tk-loc-input"
                            autoComplete="off"
                        />
                        {renderSuggestions("to", fromAirport?.code)}
                    </div>
                </div>


                <div className="tk-flightsearch-daterow">
                    <Input
                        type="date"
                        icon={<MdCalendarMonth />}
                        value={formatDate(departDate)}
                        placeholder="Onward"
                        onClick={() => setActiveCalendar("depart")}
                        className="tk-date-input"
                    />
                    {tripType === "roundtrip" && (
                        <Input
                            type="date"
                            icon={<MdCalendarMonth />}
                            value={returnDate ? formatDate(returnDate) : ""}
                            placeholder="Return"
                            onClick={() => setActiveCalendar("return")}
                            className="tk-date-input"
                        />
                    )}
                </div>


                <FareCards
                    selectedFares={selectedFares}
                    onToggleFare={setSelectedFares}
                    businessFares={businessFares}
                    onToggleBusiness={setBusinessFares}
                />

                {searchError && <p className="tk-flightsearch-error">{searchError}</p>}

                <div className="tk-flightsearch-footer">
                    <Toggle checked={nonStop} onChange={setNonStop} label="Non-stop flights only" />
                    <Button text="Search Flights" variant="primary" width="200px" onClick={handleSearch} />
                </div>
            </div>

            <CalendarModal
                isOpen={activeCalendar !== null}
                onClose={() => setActiveCalendar(null)}
                selectedDate={activeCalendar === "depart" ? departDate : returnDate}
                onSelect={handleDateSelect}
                minDate={activeCalendar === "return" ? departDate || new Date() : new Date()}
                title={activeCalendar === "depart" ? "Select Departure Date" : "Select Return Date"}
            />
        </div>
    );
}