"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface DashboardDateFilterProps {
    dateRange: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}

export function DashboardDateFilter({
                                        dateRange,
                                        onChange,
                                    }: DashboardDateFilterProps) {
    return (
        <div className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-4">
            <DatePickerWithRange
                date={dateRange}
                setDate={onChange}
                className="w-full flex flex-col gap-2 md:flex-row md:gap-4 md:w-auto"
            />
        </div>
    );
}
