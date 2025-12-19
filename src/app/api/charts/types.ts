export type ChartType = "CRAZY_HOT" | "FAFO";

export interface AnalyzeRequest {
    chart: ChartType;
    input: Record<string, number>;
}