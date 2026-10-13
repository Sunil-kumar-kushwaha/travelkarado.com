"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/utils/ApiClient";
import { EMPTY_FILTERS, FilterState, FlightResult, FlightSearchApiResponse } from "@/types/Flight.types";
import { applyFlightFilters } from "@/utils/applyFlightFilters";
import { useBooking } from "@/context/BookingContext";
import FlightResultsHeader from "@/components/flight/results/FlightResultsHeader/FlightResultsHeader";
import FlightFilters from "@/components/flight/results/FlightFilters/FlightFilters";
import FlightResultsList from "@/components/flight/results/FlightResultsList/FlightResultsList";
import "./results.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/footer/Footer";

function FlightResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { startBooking } = useBooking();

    const source = searchParams.get("source") || "";
    const destination = searchParams.get("destination") || "";
    const departureDate = searchParams.get("departureDate") || "";
    const passengers = searchParams.get("passengers") || "1";
    const tripType = searchParams.get("tripType") || "oneway"; // display only — backend doesn't use this yet

    const [apiResponse, setApiResponse] = useState<FlightSearchApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

    useEffect(() => {
        if (!source || !destination) {
            setError("Missing search details. Please search again from the home page.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        setFilters(EMPTY_FILTERS);

        apiClient
            .get<{ data: FlightSearchApiResponse }>("/api/flights/search", {
                source,
                destination,
                ...(departureDate ? { departureDate } : {}),
                passengers,
                page: "1",
                limit: "15",
            })
            .then((res) => {
                setApiResponse(res.data);
            })
            .catch(() => {
                setError("Could not load flights. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [source, destination, departureDate, passengers]);

    const flights: FlightResult[] = apiResponse?.flights || [];
    const meta = apiResponse?.meta || null;

    const filteredFlights = useMemo(() => applyFlightFilters(flights, filters), [flights, filters]);

    const handleBook = (flight: FlightResult) => {
        startBooking(
            {
                id: flight.id,
                flightId: flight.flightId,
                flightNumber: flight.flightNumber,
                airline: flight.airline,
                source: flight.source,
                destination: flight.destination,
                departureTime: flight.departureTime,
                arrivalTime: flight.arrivalTime,
                duration: flight.duration,
                price: flight.price,
                cabinClass: flight.cabinClass,
                stops: flight.stops,
                supplier: flight.supplier,
                fareKey: flight.fareKey,
            },
            parseInt(passengers, 10) || 1
        );
        router.push("/flights/book");
    };

    if (loading) {
        return <div className="flightResults__status">Searching flights across airlines...</div>;
    }

    if (error) {
        return <div className="flightResults__status flightResults__status--error">{error}</div>;
    }

    return (
        <div className="flightResults__page">
            <Header />
            <Navbar products={"flights"} />
            <div className="flightResults">
                <FlightResultsHeader
                    from={source}
                    to={destination}
                    departDate={departureDate}
                    tripType={tripType}
                    travellerSummary={`${passengers} Traveller${parseInt(passengers, 10) > 1 ? "s" : ""}`}
                />

                <div className="flightResults__body">
                    {meta && <FlightFilters flights={flights} meta={meta} filters={filters} onChange={setFilters} />}

                    <div className="flightResults__list">
                        <p className="flightResults__count">
                            {filteredFlights.length} of {flights.length} flights
                            {apiResponse && apiResponse.total > flights.length && ` (page ${apiResponse.page} of results)`}
                        </p>
                        <FlightResultsList flights={filteredFlights} onBook={handleBook} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}


export default function FlightResultsPage() {
    return (
        <Suspense fallback={<div className="flightResults__status">Loading flights...</div>}>
            <FlightResultsContent />
        </Suspense>
    );
}