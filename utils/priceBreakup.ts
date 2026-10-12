

import { AddonSelection, AppliedOffer, InsuranceSelection, PriceBreakup, SelectedFlight } from "@/types/booking.types";


const DUMMY_TAX_RATE = 0.5;

export function computePriceBreakup(
    flight: SelectedFlight,
    passengers: number,
    addons: AddonSelection[],
    insurance: InsuranceSelection,
    appliedOffer: AppliedOffer | null
): PriceBreakup {
    const baseFare = flight.price * passengers;
    const taxes = Math.round(flight.price * DUMMY_TAX_RATE) * passengers;

    const addonsTotal = addons.reduce((sum, a) => {
        return sum + (a.meal?.price || 0) + (a.baggage?.price || 0) + (a.seat?.price || 0);
    }, 0);

    const insuranceTotal = insurance.opted ? insurance.planPrice * passengers : 0;
    const discount = appliedOffer?.discount || 0;

    const totalPrice = Math.max(0, baseFare + taxes + addonsTotal + insuranceTotal - discount);

    return { baseFare, taxes, addonsTotal, insuranceTotal, discount, totalPrice };
}