

export interface TimeBucket {
    id: string;
    label: string;
    range: string;
    startHour: number; 
    endHour: number; 
}

export const TIME_BUCKETS: TimeBucket[] = [
    { id: "early_morning", label: "Early morning", range: "12 AM - 8 AM", startHour: 0, endHour: 8 },
    { id: "morning", label: "Morning", range: "8 AM - 12 PM", startHour: 8, endHour: 12 },
    { id: "afternoon", label: "Afternoon", range: "12 PM - 4 PM", startHour: 12, endHour: 16 },
    { id: "evening", label: "Evening", range: "4 PM - 8 PM", startHour: 16, endHour: 20 },
    { id: "night", label: "Night", range: "8 PM - 12 AM", startHour: 20, endHour: 24 },
];

export function getTimeBucketId(isoDateTime: string): string {
    const hour = new Date(isoDateTime).getHours();
    const bucket = TIME_BUCKETS.find((b) => hour >= b.startHour && hour < b.endHour);
    return bucket?.id || "night";
}