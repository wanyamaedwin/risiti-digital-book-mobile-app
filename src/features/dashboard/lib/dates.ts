import type { DashboardFilter } from "../types/dashboard";

export const dashboardTimezone = "Africa/Kampala";
export const demoReportingDate = "2026-11-05";
const dayMs = 86_400_000;

export function kampalaDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: dashboardTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function shiftDate(value: string, days: number): string {
  return new Date(Date.parse(`${value}T00:00:00Z`) + days * dayMs)
    .toISOString()
    .slice(0, 10);
}
export function periodRange(
  filter: Pick<DashboardFilter, "reportingDate" | "period">,
) {
  const end = filter.reportingDate;
  const weekday = new Date(`${end}T12:00:00Z`).getUTCDay();
  const start =
    filter.period === "day"
      ? end
      : filter.period === "month"
        ? `${end.slice(0, 7)}-01`
        : shiftDate(end, -((weekday + 6) % 7));
  return { start, end };
}
export function displayDate(value: string): string {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: dashboardTimezone,
  }).format(new Date(value.length === 10 ? `${value}T12:00:00+03:00` : value));
}
export function displayTime(value: string): string {
  return new Intl.DateTimeFormat("en-UG", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: dashboardTimezone,
  }).format(new Date(value));
}
export function rangeLabel(
  filter: Pick<DashboardFilter, "reportingDate" | "period">,
): string {
  const { start, end } = periodRange(filter);
  return start === end
    ? displayDate(end)
    : `${displayDate(start)} – ${displayDate(end)}`;
}
