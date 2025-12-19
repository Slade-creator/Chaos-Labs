"use client"

import { 
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
} from "recharts";

import { isDangerZone } from "@/lib/utils";


export function CrazyHotChart({ hotness, craziness} :
     {
        hotness: number;
        craziness: number;
     }) {
        const data = [{ hotness, craziness}]

         return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />

          <ReferenceArea
            x1={0}
            x2={5}
            fill="#e5e7eb"
            fillOpacity={0.6}
            label={{ value: "NO-GO", position: "insideTop", fill: "#374151" }}
            />
          <ReferenceArea
            x1={5}
            x2={8}
            y1={6}
            y2={8}
            fill="#86efac"
            fillOpacity={0.4}
            label={{ value: "FUN", position: "inside" }}
            />
          <ReferenceArea
            x1={5}
            x2={10}
            y1={8}
            y2={10}
            fill="#fca5a5"
            fillOpacity={0.4}
            label={{ value: "DANGER", position: "insideTop" }}
            />

            <ReferenceArea
              x1={8}
              x2={10}
              y1={6}
              y2={8}
              fill="#fde68a"
              fillOpacity={0.6}
              label={{ value: "DATE", position: "inside" }}
            />
          <ReferenceArea
            x1={8}
            x2={10}
            y1={4}
            y2={6}
            fill="#93c5fd"
            fillOpacity={0.4}
            label={{ value: "WIFE", position: "inside" }}
            />
          <ReferenceArea
            x1={8}
            x2={10}
            y1={0}
            y2={4}
            fill="#ddd6fe"
            fillOpacity={0.4}
            label={{ value: "UNICORN", position: "insideBottom" }}
            />

          <XAxis type="number" dataKey="hotness" domain={[0, 10]} />
          <YAxis type="number" dataKey="craziness" domain={[0, 10]} />
          <Tooltip />
          <Scatter
            data={data}
            shape={({ cx, cy }: { cx?: number; cy?: number }) => (
            <circle
            cx={cx}
            cy={cy}
            r={isDangerZone(hotness, craziness) ? 10 : 6}
            className={isDangerZone(hotness, craziness)
            ? "animate-pulse fill-red-600"
            : "fill-red-500"}
                />
              )}
            />
          
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
     }