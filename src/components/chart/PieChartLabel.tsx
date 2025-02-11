import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Cell, 
    Pie, 
    PieChart as RechartsPieChart, 
    ResponsiveContainer, 
    Tooltip,
    Legend 
} from "recharts"

interface PieChartLabelProps {
    data: unknown[]
    config: {
        colors: string[]
        value: { label: string; color: string }
    }
    title: string
    description: string
    dataKey: string
    nameKey: string
}

export function PieChartLabel({
    data,
    config,
    title,
    description,
    dataKey,
    nameKey,
}: PieChartLabelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={data}
                                dataKey={dataKey}
                                nameKey={nameKey}
                                cx="50%"
                                cy="45%" 
                                outerRadius={90} 
                                fill="#8884d8"
                            >
                                {data.map((_, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={config.colors[index % config.colors.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend 
                                layout="horizontal"
                                align="center"
                                verticalAlign="bottom"
                                wrapperStyle={{
                                    paddingTop: "20px",
                                    fontSize: "12px"
                                }}
                            />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}