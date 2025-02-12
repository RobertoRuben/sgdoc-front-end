"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface BarChartProps {
  data: unknown[];
  config: Record<string, { label: string; color: string }>;
  title: string;
  description: string;
  xAxisDataKey: string;
  bar: {
    dataKey: string;
    fill: string; 
    radius: [number, number, number, number] | number;
  };
}

export function BarChart({
  data,
  title,
  description,
  xAxisDataKey,
  bar,
}: BarChartProps) {

  const hslRegex = /hsl\(\s*(\d+),\s*(\d+)%\s*,\s*(\d+)%\s*\)/;
  const matches = bar.fill.match(hslRegex);
  let baseHue = 142;
  let baseSaturation = 76;
  let baseLightness = 36;
  if (matches) {
    baseHue = Number(matches[1]);
    baseSaturation = Number(matches[2]);
    baseLightness = Number(matches[3]);
  }
  const variation = 10; 

  const paletteColors = useMemo(() => {
    return data.map(() => {
      const randomSaturation =
        baseSaturation + (Math.floor(Math.random() * (2 * variation + 1)) - variation);
      const randomLightness =
        baseLightness + (Math.floor(Math.random() * (2 * variation + 1)) - variation);
      return `hsl(${baseHue}, ${randomSaturation}%, ${randomLightness}%)`;
    });
  }, [data, baseHue, baseSaturation, baseLightness, variation]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data}>

              <XAxis
                dataKey={xAxisDataKey}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />


              <YAxis
                allowDecimals={false}
                domain={[0, (dataMax: number) => dataMax + 5]}
                tickFormatter={(value: number) => value.toFixed(0)}
              />

              <Tooltip />

              <Bar dataKey={bar.dataKey} radius={bar.radius}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={paletteColors[index]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
