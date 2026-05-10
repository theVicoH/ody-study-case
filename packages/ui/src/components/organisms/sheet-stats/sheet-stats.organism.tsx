import React, { useMemo, useState } from "react";

import type { RestaurantDetailedStats } from "@workspace/client";

import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { BarChart } from "@/components/molecules/bar-chart/bar-chart.molecule";
import { HeatmapChart } from "@/components/molecules/heatmap-chart/heatmap-chart.molecule";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { SparklineChart } from "@/components/molecules/sparkline-chart/sparkline-chart.molecule";
import { AffluenceDialog } from "@/components/organisms/affluence-dialog/affluence-dialog.organism";
import { RevenueTrendDialog } from "@/components/organisms/revenue-trend-dialog/revenue-trend-dialog.organism";
import { TopDishesTable } from "@/components/organisms/top-dishes-table/top-dishes-table.organism";
import { WeeklyRevenueDialog } from "@/components/organisms/weekly-revenue-dialog/weekly-revenue-dialog.organism";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


interface SheetStatsLabels {
  revenue7j: string;
  covers7j: string;
  avgTicket: string;
  fillRate: string;
  todayCovers: string;
  openOrders: string;
  revenueTrend: string;
  trend24h: string;
  weeklyRevenue: string;
  last7Days: string;
  affluence: string;
  hoursVsDays: string;
  topDishes: string;
  soldWord: string;
  colRank: string;
  colDish: string;
  colCategory: string;
  colPrice: string;
  colSold: string;
  empty: string;
  paginationPrev: string;
  paginationNext: string;
  filterAll: string;
  expandStats: string;
  revenueTrendDialogTitle: string;
  revenueTrendDialogDescription: string;
  totalLabel: string;
  peakHourLabel: string;
  lowHourLabel: string;
  avgHourlyLabel: string;
  vsPriorLabel: string;
  timelineTitle: string;
  weeklyRevenueDialogTitle: string;
  weeklyRevenueDialogDescription: string;
  averageLabel: string;
  peakLabel: string;
  bestLabel: string;
  worstLabel: string;
  growthLabel: string;
  weeklyTitle: string;
  affluenceDialogTitle: string;
  affluenceDialogDescription: string;
  fillRateAvgLabel: string;
  peakSlotLabel: string;
  quietSlotLabel: string;
  heatmapTitle: string;
}

interface SheetStatsProps {
  labels: SheetStatsLabels;
  stats: RestaurantDetailedStats;
  restaurantId: string;
}

const SPARKLINE_HEIGHT = 56;
const ICON_SIZE = 16;
const TOP_DISHES_PAGE_SIZE = 6;
const FILL_RATE_GOOD_THRESHOLD = 80;
const FILL_RATE_WARN_THRESHOLD = 50;

const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOUR_LABELS = ["12h", "13h", "14h", "19h", "20h", "21h"] as const;
const SPARKLINE_X_LABELS = ["00h", "06h", "12h", "18h", "24h"] as const;
const HOURLY_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}h`);
const REVENUE_THOUSAND = 1000;
const REVENUE_HUNDRED = 100;
const REVENUE_TEN = 10;
const MS_PER_DAY = 86400000;
const DAYS_PER_WEEK = 7;
const MS_PER_WEEK = MS_PER_DAY * DAYS_PER_WEEK;

const REVENUE_FORMATTER = (value: number): string => {
  if (value >= REVENUE_THOUSAND) {
    return `€${Math.round(value / REVENUE_HUNDRED) / REVENUE_TEN}k`;
  }

  return `€${Math.round(value)}`;
};

const SPARKLINE_FORMATTER = (value: number): string => `${Math.round(value * REVENUE_HUNDRED)}%`;

const PRNG_MOD = 233280;
const PRNG_A = 9301;
const PRNG_C = 49297;

const seededRandom = (seed: number): () => number => {
  let state = seed;

  return () => {
    state = (state * PRNG_A + PRNG_C) % PRNG_MOD;

    return state / PRNG_MOD;
  };
};

const VARIANT_BASE = 0.65;
const VARIANT_RANGE = 0.5;
const NOISE_AMPLITUDE = 0.15;
const SEED_OFFSET_MULTIPLIER = 977;
const SEED_HASH_PRIME = 31;
const NOISE_CENTER = 0.5;

const buildSeed = (key: string, offset: number): number => {
  let hash = offset * SEED_OFFSET_MULTIPLIER;

  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * SEED_HASH_PRIME + key.charCodeAt(i)) % PRNG_MOD;
  }

  return hash || 1;
};

const variantValues = (
  base: ReadonlyArray<number>,
  offset: number,
  seedKey: string
): number[] => {
  if (offset === 0) {
    return [...base];
  }

  const rng = seededRandom(buildSeed(seedKey, offset));
  const factor = VARIANT_BASE + rng() * VARIANT_RANGE;

  return base.map((value) => {
    const noise = (rng() - NOISE_CENTER) * NOISE_AMPLITUDE * value;

    return Math.max(0, Math.round(value * factor + noise));
  });
};

const variantHeatmap = (
  base: ReadonlyArray<ReadonlyArray<number>>,
  offset: number,
  seedKey: string
): number[][] => {
  if (offset === 0) {
    return base.map((row) => [...row]);
  }

  const rng = seededRandom(buildSeed(seedKey, offset));
  const factor = VARIANT_BASE + rng() * VARIANT_RANGE;

  return base.map((row) =>
    row.map((cell) => {
      const noise = (rng() - NOISE_CENTER) * NOISE_AMPLITUDE;
      const next = cell * factor + noise;

      return Math.max(0, Math.min(1, next));
    }));
};

const SheetStats = ({
  labels,
  stats,
  restaurantId
}: SheetStatsProps): React.JSX.Element => {
  const [trendOpen, setTrendOpen] = useState(false);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [affluenceOpen, setAffluenceOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedWeekDate, setSelectedWeekDate] = useState<Date>(today);
  const [selectedAffluenceDate, setSelectedAffluenceDate] = useState<Date>(today);

  const selectedDayOffset = useMemo(() => {
    const diff = Math.round((today.getTime() - selectedDate.getTime()) / MS_PER_DAY);

    return Math.max(0, diff);
  }, [today, selectedDate]);

  const selectedWeekOffset = useMemo(() => {
    const diff = Math.floor((today.getTime() - selectedWeekDate.getTime()) / (MS_PER_WEEK));

    return Math.max(0, diff);
  }, [today, selectedWeekDate]);

  const selectedAffluenceOffset = useMemo(() => {
    const diff = Math.floor((today.getTime() - selectedAffluenceDate.getTime()) / (MS_PER_WEEK));

    return Math.max(0, diff);
  }, [today, selectedAffluenceDate]);

  const hourlyForSelected = useMemo(
    () => variantValues(stats.sparklineData, selectedDayOffset, `${restaurantId}-day`),
    [stats.sparklineData, selectedDayOffset, restaurantId]
  );

  const weeklyForSelected = useMemo(
    () => variantValues(stats.weeklyRevenue, selectedWeekOffset, `${restaurantId}-week`),
    [stats.weeklyRevenue, selectedWeekOffset, restaurantId]
  );

  const heatmapForSelected = useMemo(
    () => variantHeatmap(stats.heatmap, selectedAffluenceOffset, `${restaurantId}-aff`),
    [stats.heatmap, selectedAffluenceOffset, restaurantId]
  );

  const formattedRevenue = `€${stats.todayRevenue.toLocaleString("fr-FR")}`;
  const formattedAvgTicket = `€${stats.avgTicket.toLocaleString("fr-FR")}`;
  const formattedFillRate = `${stats.fillRate}%`;

  return (
    <div className="gap-md @container flex flex-col">
      <div className="gap-sm grid grid-cols-2 lg:grid-cols-3">
        <KpiCard
          variant="subtle"
          label={labels.revenue7j}
          value={formattedRevenue}
          trend={stats.trend}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.covers7j}
          value={stats.covers}
          trend={stats.trend}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.avgTicket}
          value={formattedAvgTicket}
          trend={stats.trend}
          trendDirection="up"
        />
        <KpiCard
          variant="subtle"
          label={labels.fillRate}
          value={formattedFillRate}
          trend={stats.fillRate >= FILL_RATE_GOOD_THRESHOLD ? "↑" : stats.fillRate >= FILL_RATE_WARN_THRESHOLD ? "~" : "↓"}
          trendDirection={stats.fillRate >= FILL_RATE_WARN_THRESHOLD ? "up" : "down"}
        />
        <KpiCard
          variant="subtle"
          label={labels.todayCovers}
          value={stats.todayCovers}
        />
        <KpiCard
          variant="subtle"
          label={labels.openOrders}
          value={stats.openOrders}
        />
      </div>

      <div className="gap-md grid grid-cols-1 @2xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{labels.revenueTrend}</CardTitle>
            <CardAction className="gap-2xs flex items-center">
              <Badge variant="ghost">{labels.trend24h}</Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={labels.expandStats}
                onClick={() => setTrendOpen(true)}
              >
                <ArrowRightIcon size={ICON_SIZE} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-sm pb-xs px-0">
            <SparklineChart
              data={stats.sparklineData}
              height={SPARKLINE_HEIGHT}
              xLabels={[...SPARKLINE_X_LABELS]}
              formatValue={SPARKLINE_FORMATTER}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{labels.weeklyRevenue}</CardTitle>
            <CardAction className="gap-2xs flex items-center">
              <Badge variant="ghost">{labels.last7Days}</Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={labels.expandStats}
                onClick={() => setWeeklyOpen(true)}
              >
                <ArrowRightIcon size={ICON_SIZE} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <BarChart
              values={stats.weeklyRevenue}
              labels={[...DAY_LABELS_EN]}
              formatValue={REVENUE_FORMATTER}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{labels.affluence}</CardTitle>
          <CardAction className="gap-2xs flex items-center">
            <Badge variant="ghost">{labels.hoursVsDays}</Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={labels.expandStats}
              onClick={() => setAffluenceOpen(true)}
            >
              <ArrowRightIcon size={ICON_SIZE} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <HeatmapChart
            data={stats.heatmap}
            hourLabels={[...HOUR_LABELS]}
            dayLabels={[...DAY_LABELS_EN]}
          />
        </CardContent>
      </Card>

      <div className="gap-xs flex flex-col">
        <p className="text-muted-foreground typo-overline px-2xs">{labels.topDishes}</p>
        <div className="h-full">
          <TopDishesTable
            items={stats.topItems}
            pageSize={TOP_DISHES_PAGE_SIZE}
            labels={{
              colRank: labels.colRank,
              colDish: labels.colDish,
              colCategory: labels.colCategory,
              colPrice: labels.colPrice,
              colSold: labels.colSold,
              empty: labels.empty,
              previous: labels.paginationPrev,
              next: labels.paginationNext,
              filterAll: labels.filterAll,
              soldWord: labels.soldWord
            }}
          />
        </div>
      </div>

      <RevenueTrendDialog
        open={trendOpen}
        onOpenChange={setTrendOpen}
        labels={{
          title: labels.revenueTrendDialogTitle,
          description: labels.revenueTrendDialogDescription,
          total: labels.totalLabel,
          peakHour: labels.peakHourLabel,
          lowHour: labels.lowHourLabel,
          avgHourly: labels.avgHourlyLabel,
          vsPrior: labels.vsPriorLabel,
          timelineTitle: labels.timelineTitle
        }}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        maxDate={today}
        hourlyValues={hourlyForSelected}
        hourlyLabels={HOURLY_LABELS}
        formatRevenue={REVENUE_FORMATTER}
      />

      <WeeklyRevenueDialog
        open={weeklyOpen}
        onOpenChange={setWeeklyOpen}
        labels={{
          title: labels.weeklyRevenueDialogTitle,
          description: labels.weeklyRevenueDialogDescription,
          total: labels.totalLabel,
          average: labels.averageLabel,
          peak: labels.peakLabel,
          best: labels.bestLabel,
          worst: labels.worstLabel,
          growth: labels.growthLabel,
          weeklyTitle: labels.weeklyTitle
        }}
        selectedDate={selectedWeekDate}
        onSelectedDateChange={setSelectedWeekDate}
        maxDate={today}
        weeklyValues={weeklyForSelected}
        weeklyLabels={[...DAY_LABELS_EN]}
        formatRevenue={REVENUE_FORMATTER}
      />

      <AffluenceDialog
        open={affluenceOpen}
        onOpenChange={setAffluenceOpen}
        labels={{
          title: labels.affluenceDialogTitle,
          description: labels.affluenceDialogDescription,
          fillRate: labels.fillRateAvgLabel,
          peakSlot: labels.peakSlotLabel,
          quietSlot: labels.quietSlotLabel,
          heatmapTitle: labels.heatmapTitle
        }}
        selectedDate={selectedAffluenceDate}
        onSelectedDateChange={setSelectedAffluenceDate}
        maxDate={today}
        data={heatmapForSelected}
        hourLabels={[...HOUR_LABELS]}
        dayLabels={[...DAY_LABELS_EN]}
      />
    </div>
  );
};

export { SheetStats };

export type { SheetStatsProps, SheetStatsLabels };
