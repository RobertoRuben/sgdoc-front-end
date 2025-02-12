"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

interface BarCharHorizontalProps {
  data: Array<Record<string, unknown>>;
  config: Record<string, { label: string; color: string }>;
  title: string;
  description: string;
  yAxisDataKey: string;
  bar: {
    dataKey: string;
    fill: string;
    radius: number[];
  };
}

export function BarCharHorizontal({
  data,
  title,
  description,
  yAxisDataKey,
  bar,
}: BarCharHorizontalProps) {
  const greens = [
    "#14532d",
    "#166534",
    "#15803d",
    "#16a34a",
    "#22c55e",
    "#4ade80",
    "#86efac",
    "#bbf7d0",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data || []}      
              layout="vertical"
              margin={{
                top: 0,
                right: 30,
                left: 40,
                bottom: 0,
              }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[0, (dataMax: number) => dataMax + 0]}
                tickFormatter={(value: number) => value.toFixed(0)}
              />

              <YAxis dataKey={yAxisDataKey} type="category" />

              <Tooltip />

              <Bar dataKey={bar.dataKey} >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={greens[index % greens.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
