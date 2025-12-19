import { encode } from "@toon-format/toon";

export function encodeToon(context: object) {
    return encode(context);
}