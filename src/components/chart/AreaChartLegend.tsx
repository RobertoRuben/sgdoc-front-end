
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AreaChartLegendProps {
    data: unknown[]
    config: Record<string, { label: string; color: string }>
    title: string
    description: string
    xAxisDataKey: string
    series: Array<{ dataKey: string; fill: string; stroke: string }>
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
                <div className="flex items-center gap-4">
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
                            <XAxis dataKey={xAxisDataKey} />
                            <YAxis />
                            <Tooltip />
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
    )
}