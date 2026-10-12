

const INDIAN_AIRPORT_CODES = new Set([
    "DEL", "BOM", "BLR", "MAA", "CCU", "HYD", "COK", "GOI", "AMD", "PNQ",
    "JAI", "LKO", "IXC", "PAT", "GAU", "IXR", "VNS", "IDR", "NAG", "BBI",
]);

export function isInternationalRoute(source: string, destination: string): boolean {
    return !INDIAN_AIRPORT_CODES.has(source.toUpperCase()) || !INDIAN_AIRPORT_CODES.has(destination.toUpperCase());
}