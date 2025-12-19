import { NextResponse } from "next/server";
import { encodeToon } from "@/lib/toon";
import { openRouter } from "@/lib/openrouter";
import { analyzeChart } from "../charts/router";


export async function POST(req: Request) {
    const body = await req.json();
    const { chart, input } = body;

    const { zone, context } = analyzeChart(chart, input);

    const toon = encodeToon(context);

    const completion = await openRouter.chat.send({
        model: "openai/gpt-oss-120b:free",
        stream: false,
        messages: [
            {
                role: "system",
                content: `
                You are interpreting a structured TOON document.
                Follow all constraints strictly.
                Do not add new rules.
                Do not moralize.
                Respond concisely and playfully
                `.trim(),
            },
            {
                role: "user",
                content: toon
            }
        ],
    });

    return NextResponse.json({
        zone,
        explanation: completion.choices[0].message.content,
    });
}