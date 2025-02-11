
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface BarCharHorizontalProps {
    data: unknown[]
    config: Record<string, { label: string; color: string }>
    title: string
    description: string
    yAxisDataKey: string
    bar: {
        dataKey: string
        fill: string
        radius: number[]
    }
}

export function BarCharHorizontal({
                                      data,
                                      title,
                                      description,
                                      yAxisDataKey,
                                      bar,
                                  }: BarCharHorizontalProps) {
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
                            data={data}
                            layout="vertical"
                            margin={{
                                top: 0,
                                right: 30,
                                left: 40,
                                bottom: 0,
                            }}
                        >
                            <XAxis type="number" />
                            <YAxis dataKey={yAxisDataKey} type="category" />
                            <Tooltip />
                            <Bar
                                dataKey={bar.dataKey}
                                fill={bar.fill}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}