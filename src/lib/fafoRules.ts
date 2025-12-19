export type FAFOZone =
| "SAFE"
| "WARNING"
| "FAFO"
| "DISASTER"
| "LEGENDARY"

export function resolveFAFO(
    fuckAround: number,
    findOut: number
): FAFOZone {
    if (fuckAround <= 3 && findOut <= 3) return "SAFE";

    if (fuckAround <= 6 && findOut <= 5) return "WARNING";

    if (fuckAround >= 6 && findOut <= 8) return "FAFO";

    if (fuckAround >= 7 && findOut >= 8) return "DISASTER";

    if (fuckAround >= 9 && findOut >= 9) return "LEGENDARY";

    return 'WARNING'
}