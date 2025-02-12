"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CardData {
  title: string
  value: number | string
  change: string
  icon: React.ComponentType<{ className?: string }>
  /** 
   * color se usaba antes para el icono; ahora podría usarse si quieres cambiar 
   * el color del icono en la parte inferior. Puedes dejarlo o quitarlo según necesidad.
   */
  color: string
  /**
   * bgColor debe ser un color “real” para fondo, 
   * p. ej.: "bg-rose-500" si quieres usar clases Tailwind
   * o directamente un código hex/rgb si planeas usar inline styles.
   */
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
          {/*
            Aquí, en lugar de usar style={{ backgroundColor: card.bgColor }}
            se aplica la clase de Tailwind que recibes en card.bgColor.

            Ejemplo: card.bgColor = "bg-rose-500"
          */}
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
