"use client";
import { useState } from "react";
import { MdFlightTakeoff, MdFlightLand, MdCalendarMonth, MdSwapHoriz } from "react-icons/md";
import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import Toggle from "@/components/common/Toggle/Toggle";
import CalendarModal from "@/components/common/Calendar/CalendarModal";
import TripType from "@/components/flight/TripType/TripType";
import TravellerSelector from "@/components/flight/TravellerSelector/TravellerSelector";
import FareCards from "@/components/flight/FareCards/FareCards";
import "./FlightSearch.css";

const TRIP_OPTIONS = [
    { value: "oneway", label: "One way" },
    { value: "roundtrip", label: "Round trip" },
];

const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
};

export default function FlightSearch() {
    const [tripType, setTripType] = useState("oneway");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [departDate, setDepartDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [returnDate, setReturnDate] = useState(null);
    const [activeCalendar, setActiveCalendar] = useState(null); 

    const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0, travelClass: "Economy" });
    const [selectedFares, setSelectedFares] = useState(new Set());
    const [businessFares, setBusinessFares] = useState(false);
    const [nonStop, setNonStop] = useState(false);

    const handleSwap = () => {
        setFrom(to);
        setTo(from);
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
        console.log("Searching flights:", {
            tripType,
            from,
            to,
            departDate,
            returnDate,
            travellers,
            selectedFares: Array.from(selectedFares),
            businessFares,
            nonStop,
        });
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
                    <Button
                        text="Track flights"
                        variant="outline"
                        icon={<MdFlightTakeoff />}
                        className="tk-track-btn"
                        onClick={() => console.log("open track flights")}
                    />
                </div>

                
                <div className="tk-flightsearch-locrow">
                    <Input
                        icon={<MdFlightTakeoff />}
                        placeholder="Where from?"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="tk-loc-input"
                    />
                    <button type="button" className="tk-swap-btn" onClick={handleSwap} aria-label="Swap origin and destination">
                        <MdSwapHoriz />
                    </button>
                    <Input
                        icon={<MdFlightLand />}
                        placeholder="Where to?"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="tk-loc-input"
                    />
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

                
                <div className="tk-flightsearch-footer">
                    <Toggle checked={nonStop} onChange={setNonStop} label="Non-stop flights only" />
                    <Button text="Search Flights" variant="primary" width="220px" onClick={handleSearch} />
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