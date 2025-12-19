export function buildFafoContext(
    fuckAround: number,
    findOut: number,
    zone: string
) {
    return {
        chart: {
            name: "FAFO Chart",
            version: "1.0",
            description: "Cause vs consequence analysis",
            dynamic: true
        },

        input: {
            fuckAround,
            findOut
        },

        result: {
            zone
        },

        zoneDefinition: [
            { id: "SAFE", meaning: "Minimal risk, minimal impact" },
            { id: "WARNING", meaning: "Risk increasing, consequences likely" },
            { id: "FAFO", meaning: "Action meet consequences" },
            { id: "DISASTER", meaning: "Severe irreversible outcome" },
            { id: "WIFE_ZONE", meaning: "Extreme outcome remembered forever" }
        ],

        rules: [
            "chart is satirical",
            "No moral judgement",
            "Higher fuckAround increases probability of findOut",
            "Outcomes are non-linear"
        ],

        constraints: {
            maxSentences: 4,
            tone: "dark humor",
            forbidJudgement: true
        }
    };
}