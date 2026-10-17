import { BookingStatus } from "@/types/trips.types";

export const STATUS_LABEL: Record<BookingStatus, string> = {
    pending: "Payment pending",
    paid: "Confirmed",
    failed: "Payment failed",
    cancelled: "Cancelled",
};

export const formatINR = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export const formatDate = (iso: string | number) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatTime = (iso: string | number) =>
    new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

export const formatDateTime = (iso: string | number) => `${formatDate(iso)}, ${formatTime(iso)}`;

export const stopsLabel = (n: number) => (n === 0 ? "Non-stop" : `${n} stop${n > 1 ? "s" : ""}`);

// show only the last 3 characters of a passport number
export const maskPassport = (n: string) => (n.length > 3 ? "•".repeat(n.length - 3) + n.slice(-3) : n);