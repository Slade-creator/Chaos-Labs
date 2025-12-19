import { resolveZone } from "@/lib/rules";
import { buildContext } from "@/lib/context";
import { resolveFAFO } from "@/lib/fafoRules";
import { buildFafoContext } from "@/lib/fafoContext";

 interface CrazyHotInput {
  hotness: number;
  craziness: number;
}

 interface FafoInput {
  fuckAround: number;
  findOut: number;
}

export const runtime = "nodejs";


function ensureFafoInput(input: unknown): FafoInput {
    if (!input || typeof input !== "object") {
    throw new Error("Input must be an object");
  }

  const { fuckAround, findOut } = input as Record<string, unknown>;

  if (typeof fuckAround !== "number" || isNaN(fuckAround)) {
    throw new Error('"fuckAround" must be a number');
  }
  if (typeof findOut !== "number" || isNaN(findOut)) {
    throw new Error('"findOut" must be a number');
  }

  return { fuckAround, findOut };
}

function ensureCrazyHotInput(input: unknown): CrazyHotInput {
  if (!input || typeof input !== "object") {
    throw new Error("Input must be an object");
  }

  const { hotness, craziness } = input as Record<string, unknown>;

  if (typeof hotness !== "number" || isNaN(hotness)) {
    throw new Error('"hotness" must be a number');
  }
  if (typeof craziness !== "number" || isNaN(craziness)) {
    throw new Error('"craziness" must be a number');
  }

  return { hotness, craziness };
}

export function analyzeChart(chart: string, input: unknown) {
try {
    switch(chart) {
        case "CRAZY_HOT": {
            const { hotness, craziness} = ensureCrazyHotInput(input);

            const h = Math.max(0, Math.min(10, Number(hotness)));
        const c = Math.max(4, Math.min(10, Number(craziness)));

            const zone = resolveZone(h, c);
            const context = buildContext(h, c, zone);
            return { zone, context};
        } 

        case "FAFO": {
            const { fuckAround, findOut } = ensureFafoInput(input);

            const fa = Math.round(Math.max(0, Math.min(10, Number(fuckAround))));
            const fo = Math.round(Math.max(0, Math.min(10, Number(findOut))));

            const zone = resolveFAFO(fa, fo);
            const context = buildFafoContext(fa, fo, zone);
            return { zone, context}
        }

        default: 
            throw new Error(`Unknown chart type: ${chart}`)
    }
} catch (error) {
      console.error(`[analyzeChart] Failed for ${chart}:`, error);
      throw new Error(`Invalid input for chart "${chart}": ${(error as Error).message}`);
}
}