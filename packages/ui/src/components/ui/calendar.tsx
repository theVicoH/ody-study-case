import * as React from "react";

import { DayPicker } from "react-day-picker";

import { ArrowLeftIcon } from "@/components/icons/arrow-left/arrow-left.icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { cn } from "@/lib/utils";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

const NAV_BTN_CLASSES = "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex size-7 items-center justify-center rounded-md border bg-transparent transition-colors disabled:pointer-events-none disabled:opacity-50";

const DAY_BTN_CLASSES = "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 selected:bg-primary selected:text-primary-foreground selected:hover:bg-primary selected:hover:text-primary-foreground size-8 rounded-md p-0 font-normal aria-selected:opacity-100";

const CHEVRON_SIZE = 16;

const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps): React.JSX.Element => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("relative p-3", className)}
    classNames={{
      months: "flex flex-col gap-2 sm:flex-row",
      month: "flex flex-col gap-4",
      month_caption: "flex w-full items-center justify-center pt-1",
      caption_label: "text-sm font-medium",
      nav: "absolute inset-x-3 top-3 flex items-center justify-between",
      button_previous: NAV_BTN_CLASSES,
      button_next: NAV_BTN_CLASSES,
      month_grid: "w-full border-collapse",
      weekdays: "flex",
      weekday: "text-muted-foreground w-8 rounded-md text-[0.8rem] font-normal",
      week: "mt-2 flex w-full",
      day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
      day_button: DAY_BTN_CLASSES,
      range_end: "day-range-end",
      selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
      today: "bg-accent text-accent-foreground rounded-md",
      outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      disabled: "text-muted-foreground opacity-50",
      range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
      hidden: "invisible",
      ...classNames
    }}
    components={{
      Chevron: ({ orientation }) => orientation === "left"
        ? <ArrowLeftIcon size={CHEVRON_SIZE} />
        : <ArrowRightIcon size={CHEVRON_SIZE} />
    }}
    {...props}
  />
);

Calendar.displayName = "Calendar";

export { Calendar };

export type { CalendarProps };
