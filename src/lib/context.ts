export function buildContext(
    hotness: number,
    craziness: number,
    zone: string
) {
    return {
        chart: {
            name: "Crazy-hotness Chart",
            version: "1.0",
            dynamic: true,
            axes: {
                x: "hotness",
                y: "craziness",
                crazinessStartsAt: 4
            }
        },

        input: {
            hotness,
            craziness
        },

        result: {
            zone
        },

        zoneDefinition: [
            { id: "NO_GO", description: "Low attraction, avoid" },
            { id: "FUN_ZONE", description: "Short-term excitement" },
            { id: "DANGER_ZONE", description: "High risk, high chaos" },
            { id: "DATE_ZONE", description: "Stable dating range" },
            { id: "WIFE_ZONE", description: "Long-term compatibility" },
            { id: "UNICORN_ZONE", description: "Theoretical anomaly" }
        ],

        rules: [
            "chart is satirical",
            "Zones are non-static",
            "Entities may move across zones",
            "Chart becomes reliable with sufficient data"
        ],

        constraints: {
            maxSentences: 4,
            tone: "playful",
            forbidJudgement: true
        }
    };
}