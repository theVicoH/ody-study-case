const PERCENT = 100;
const HALF = 2;
const ONE_DECIMAL = 10;

const sumValues = (values: ReadonlyArray<number>): number =>
  values.reduce((acc, v) => acc + v, 0);

const averageValues = (values: ReadonlyArray<number>): number =>
  values.length === 0 ? 0 : sumValues(values) / values.length;

const peakValue = (values: ReadonlyArray<number>): number =>
  values.length === 0 ? 0 : Math.max(...values);

const minValueOf = (values: ReadonlyArray<number>): number =>
  values.length === 0 ? 0 : Math.min(...values);

const indexOfMax = (values: ReadonlyArray<number>): number =>
  values.length === 0 ? -1 : values.indexOf(Math.max(...values));

const indexOfMin = (values: ReadonlyArray<number>): number =>
  values.length === 0 ? -1 : values.indexOf(Math.min(...values));

const formatPercentDelta = (values: ReadonlyArray<number>): string => {
  if (values.length < HALF) {
    return "—";
  }

  const half = Math.floor(values.length / HALF);
  const prev = sumValues(values.slice(0, half));
  const curr = sumValues(values.slice(half));

  if (prev === 0) {
    return "—";
  }

  const delta = ((curr - prev) / prev) * PERCENT;
  const rounded = Math.round(delta * ONE_DECIMAL) / ONE_DECIMAL;
  const sign = rounded > 0 ? "+" : "";

  return `${sign}${rounded}%`;
};

const deltaDirectionFrom = (delta: string): "up" | "down" =>
  delta.startsWith("-") ? "down" : "up";

const labelAtIndex = (
  labels: ReadonlyArray<string>,
  index: number,
  fallback = "—"
): string => (index >= 0 ? (labels[index] ?? fallback) : fallback);

export {
  sumValues,
  averageValues,
  peakValue,
  minValueOf,
  indexOfMax,
  indexOfMin,
  formatPercentDelta,
  deltaDirectionFrom,
  labelAtIndex
};
