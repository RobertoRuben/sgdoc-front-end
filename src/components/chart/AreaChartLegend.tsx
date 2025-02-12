"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AreaChartLegendProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  config: Record<string, { label: string; color: string }>;
  title: string;
  description: string;
  xAxisDataKey: string;
  series: Array<{ dataKey: string; fill: string; stroke: string }>;
}

export function AreaChartLegend({
  data,
  config,
  title,
  description,
  xAxisDataKey,
  series,
}: AreaChartLegendProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex flex-wrap items-center gap-4">
          {/* Leyenda generada dinámicamente */}
          {Object.entries(config).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* Eje X */}
              <XAxis dataKey={xAxisDataKey} />

              {/* Eje Y con configuraciones específicas */}
              <YAxis
                allowDecimals={false}
                domain={[0, (dataMax: number) => dataMax + 5]} 
                tickFormatter={(value: number) => value.toFixed(0)}
              />

              {/* Tooltip para mostrar valores al pasar el mouse */}
              <Tooltip />

              {/* Áreas dinámicas, una por cada serie */}
              {series.map((serie, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={serie.dataKey}
                  fill={serie.fill}
                  stroke={serie.stroke}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
