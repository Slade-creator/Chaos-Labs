export type Zone = 
| "NO_GO"
| "FUN_ZONE"
| "DANGER_ZONE"
| "DATE_ZONE"
| "WIFE_ZONE"
| "UNICORN_ZONE"

export function resolveZone(hotness: number, craziness: number): Zone {
    if(hotness <= 5) return "NO_GO";

    if(hotness >= 8 && craziness === 4) return "UNICORN_ZONE";

    if(hotness >= 5 && craziness >= 8) return "DANGER_ZONE";

    if(hotness >= 8 && craziness >= 6 && craziness <= 8) return "DATE_ZONE";

    if(hotness >= 8 && craziness >= 4 && craziness <= 6) return "WIFE_ZONE"

    if(hotness >= 5 && hotness <=8 && craziness >= 6 && craziness <= 8) return "FUN_ZONE";

    return "NO_GO";
}