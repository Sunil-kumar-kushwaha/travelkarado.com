

import { FilterState, FlightResult } from "@/types/Flight.types";
import { getTimeBucketId } from "@/utils/timeBuckets";

export function applyFlightFilters(flights: FlightResult[], filters: FilterState): FlightResult[] {
    return flights.filter((f) => {
        if (filters.stops.length > 0) {
            const bucket = f.stops >= 2 ? 2 : f.stops;
            if (!filters.stops.includes(bucket)) return false;
        }

        if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) {
            return false;
        }

        if (filters.timings.length > 0 && !filters.timings.includes(getTimeBucketId(f.departureTime))) {
            return false;
        }

        if (filters.maxPrice !== null && f.price > filters.maxPrice) {
            return false;
        }

        return true;
    });
}