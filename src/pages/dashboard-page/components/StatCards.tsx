"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CardData {
  title: string
  value: number | string
  change: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  trend: "up" | "down"
}

interface StatCardsProps {
  cards: CardData[]
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", card.bgColor)}>
            <CardTitle className="text-sm font-medium text-white">
              {card.title}
            </CardTitle>
            <div className="text-white">
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-2">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
