"use client"

import { addYears, format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    className?: string
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
                                        className,
                                        date,
                                        setDate,
                                    }: DatePickerWithRangeProps) {
    const today = new Date()
    const tenYearsAgo = addYears(today, -10)
    const tenYearsFromNow = addYears(today, 10)

    const handleFromDateSelect = (selectedDate: Date | undefined) => {
        setDate({
            from: selectedDate,
            to: date?.to,
        })
    }

    const handleToDateSelect = (selectedDate: Date | undefined) => {
        setDate({
            from: date?.from,
            to: selectedDate,
        })
    }

    return (
        <div className={cn("flex gap-4", className)}>
            {/* Fecha inicial */}
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal bg-white/50 backdrop-blur-sm border-zinc-200 hover:bg-white/80 transition-colors shadow-sm",
                                !date?.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                            {date?.from ? (
                                // 2. Pasa locale: es a format
                                format(date.from, "dd MMM, yyyy", { locale: es })
                            ) : (
                                <span>Fecha inicial</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-zinc-200 shadow-lg rounded-lg"
                        align="start"
                    >
                        {/* 3. Pasa la prop locale={es} al Calendar */}
                        <Calendar
                            locale={es}
                            initialFocus
                            mode="single"
                            defaultMonth={date?.from}
                            selected={date?.from}
                            onSelect={handleFromDateSelect}
                            fromYear={tenYearsAgo.getFullYear()}
                            toYear={tenYearsFromNow.getFullYear()}
                            captionLayout="dropdown-buttons"
                            showOutsideDays={false}
                            fixedWeeks
                            className="rounded-md"
                            classNames={{
                                months: "space-y-4",
                                month: "space-y-4",
                                caption:
                                    "flex justify-center pt-1 relative items-center px-8",
                                caption_label:
                                    "text-sm font-medium text-emerald-600",
                                nav: "space-x-1 flex items-center",
                                nav_button: cn(
                                    "h-7 w-7 bg-transparent p-0 text-zinc-500 hover:text-emerald-500 transition-colors"
                                ),
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                    "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell:
                                    "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-emerald-50",
                                day: cn(
                                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-100 rounded-md transition-colors"
                                ),
                                day_selected:
                                    "bg-emerald-500 text-white hover:bg-emerald-500",
                                day_today: "bg-zinc-100 text-zinc-900",
                                day_outside: "text-zinc-400 opacity-50",
                                day_disabled: "text-zinc-400 opacity-50",
                                day_hidden: "invisible",
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Fecha final */}
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal bg-white/50 backdrop-blur-sm border-zinc-200 hover:bg-white/80 transition-colors shadow-sm",
                                !date?.to && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                            {date?.to ? (
                                format(date.to, "dd MMM, yyyy", { locale: es })
                            ) : (
                                <span>Fecha final</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 bg-white/95 backdrop-blur-sm border border-zinc-200 shadow-lg rounded-lg"
                        align="end"
                    >
                        <Calendar
                            locale={es}
                            initialFocus
                            mode="single"
                            defaultMonth={date?.to}
                            selected={date?.to}
                            onSelect={handleToDateSelect}
                            fromYear={tenYearsAgo.getFullYear()}
                            toYear={tenYearsFromNow.getFullYear()}
                            captionLayout="dropdown-buttons"
                            showOutsideDays={false}
                            fixedWeeks
                            className="rounded-md"
                            classNames={{
                                months: "space-y-4",
                                month: "space-y-4",
                                caption:
                                    "flex justify-center pt-1 relative items-center px-8",
                                caption_label:
                                    "text-sm font-medium text-emerald-600",
                                nav: "space-x-1 flex items-center",
                                nav_button: cn(
                                    "h-7 w-7 bg-transparent p-0 text-zinc-500 hover:text-emerald-500 transition-colors"
                                ),
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                    "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell:
                                    "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-emerald-50",
                                day: cn(
                                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-100 rounded-md transition-colors"
                                ),
                                day_selected:
                                    "bg-emerald-500 text-white hover:bg-emerald-500",
                                day_today: "bg-zinc-100 text-zinc-900",
                                day_outside: "text-zinc-400 opacity-50",
                                day_disabled: "text-zinc-400 opacity-50",
                                day_hidden: "invisible",
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
