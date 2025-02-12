import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"

interface BarChartProps {
  data: unknown[];
  config: Record<string, { label: string; color: string }>;
  title: string;
  description: string;
  xAxisDataKey: string;
  bar: {
    dataKey: string;
    fill: string;
    radius: number[];
  };
}

export function BarChart({
  data,
  title,
  description,
  xAxisDataKey,
  bar,
}: BarChartProps) {
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
              {/* Eje X */}
              <XAxis
                dataKey={xAxisDataKey}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />

              {/* Eje Y con ajustes para solo enteros + margen */}
              <YAxis
                allowDecimals={false}
                domain={[0, (dataMax: number) => dataMax + 5]}
                tickFormatter={(value: number) => value.toFixed(0)}
              />

              <Tooltip />

              <Bar
                dataKey={bar.dataKey}
                fill={bar.fill}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
