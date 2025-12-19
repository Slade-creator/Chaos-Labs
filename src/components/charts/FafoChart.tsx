"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export function FafoChart({ fafo }: { fafo: number }) {
  const data = Array.from({ length: 11 }, (_, i) => ({
    level: i,
    consequence: i * i,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          <ReferenceArea
            y1={0}
            y2={10}
            fill="#86efac"
            fillOpacity={0.3}
            label={{ value: "SAFE", position: "insideTop" }}
            />
          <ReferenceArea
            y1={10}
            y2={40}
            fill="#fde68a"
            fillOpacity={0.3}
            label={{ value: "WARNING", position: "inside" }}
            />
          <ReferenceArea
            y1={40}
            y2={100}
            fill="#fca5a5"
            fillOpacity={0.3}
            label={{ value: "FIND OUT", position: "insideBottom" }}
            />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="level" domain={[0, 10]} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="consequence"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceDot
            x={fafo}
            y={fafo * fafo}
            r={fafo >= 7 ? 10 : 6}
           className={
    fafo >= 9
      ? "fill-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"
      : fafo >= 7
        ? "fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
        : "fill-orange-400"
  }
  />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
