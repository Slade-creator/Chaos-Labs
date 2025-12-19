import { NextResponse } from "next/server";
import { analyzeChart } from "../charts/router";
import { encodeToon } from "@/lib/toon";
import { openRouter } from "@/lib/openrouter";

function extractNumbsFromLLM(text: string): { 
    fuckAround: number;
    findOut: number;
} {
    try {

        const jsonMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```|({[\s\S]*?})/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[2] : text;

        const parsed = JSON.parse(jsonStr);

        let fa = Number(parsed.fuckAround);
        let fo = Number(parsed.findOut);

        fa = Math.round(Math.max(0, Math.min(10, fa)));
        fo = Math.round(Math.max(0, Math.min(10, fo)));

        if (isNaN(fa) || isNaN(fo)) throw new Error("NaN after parsing")
        
        return { fuckAround: fa, findOut: fo };
    } catch (e) {
        console.warn("Failed to parse LLM response. Using defaults.", { text, error: e });
        return { fuckAround: 5, findOut: 5 };
    }
} 

export async function POST(req: Request) {

    try {
        const body = await req.json();
        const { chart, input } = body;

        if (typeof input === "string" && input.trim() !== "") {
            const extraction = await openRouter.chat.send({
                model: "openai/gpt-oss-120b:free",
                stream: false,
                messages: [
          {
            role: "system",
            content: `You are a satirical chaos analyst. Extract two integers (0–10):

- "fuckAround": boldness/stupidity of the action (0 = nap, 10 = unplug the Matrix)
- "findOut": severity of consequences (0 = nothing, 10 = timeline collapse)

RETURN ONLY VALID JSON. Example: {"fuckAround":7,"findOut":9}`,
          },
          { role: "user", content: input.trim() },
        ],
            });

            const rawContent = extraction.choices?.[0]?.message?.content;
            const aiReplay = typeof rawContent === "string" ? rawContent : "";
            const { fuckAround, findOut } = extractNumbsFromLLM(aiReplay);

            const { zone, context } = analyzeChart(chart, { fuckAround, findOut });
            const toon = encodeToon(context);

            const explanationRes = await openRouter.chat.send({
                model: "openai/gpt-oss-120b:free",
                stream: false,
                messages: [
                {
                    role: "system",
                    content: `Interpret the TOON.
        - No moralizing.
        - Dark humor only.
        - Roast the person.
        - Max 4 sentences.
        - Be concise and vivid.`
                    .trim(),
                },
                { role: "user", content: toon },
                ],
            });

            const explanation = explanationRes.choices[0].message.content;
            
             return NextResponse.json({
                 zone,
                 explanation,
                 fuckAround,
                 findOut,
    });

        }

} catch(error) {
    console.error("[/api/fafo] Server error:", error);
    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown server error",
        zone: "ERROR",
        explanation: "The chaos oracle is meditating. Try again in a moment.",
      },
      { status: 500 }
    );   
}
}