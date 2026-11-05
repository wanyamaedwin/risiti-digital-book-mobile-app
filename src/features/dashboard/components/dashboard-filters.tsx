import {
  FormField,
  AppSelect,
  AppInput,
} from "@/components/shared/form-controls";
import { AppCard } from "@/components/shared/cards";
import { validDate, rangeLabel } from "../lib/dates";
import type {
  DashboardData,
  DashboardFilter,
  DashboardPeriod,
} from "../types/dashboard";

export function PeriodSelector({
  value,
  onChange,
  personal = false,
}: {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
  personal?: boolean;
}) {
  return (
    <FormField label="Reporting period">
      <AppSelect
        value={value}
        onChange={(event) => onChange(event.target.value as DashboardPeriod)}
      >
        {!personal && <option value="day">Today (selected date)</option>}
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </AppSelect>
    </FormField>
  );
}
export function DashboardFilters({
  filter,
  branches,
  personal,
  onChange,
}: {
  filter: DashboardFilter;
  branches: DashboardData["branches"];
  personal: boolean;
  onChange: (filter: DashboardFilter) => void;
}) {
  return (
    <AppCard className="gap-4">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <PeriodSelector
          value={filter.period}
          personal={personal}
          onChange={(period) => onChange({ ...filter, period })}
        />
        <FormField
          label="Reporting date"
          hint="Demo reference date; all periods end on this date."
        >
          <AppInput
            type="date"
            value={filter.reportingDate}
            min="2020-01-01"
            max="2099-12-31"
            onChange={(event) => {
              if (
                validDate(event.target.value) &&
                event.target.value >= "2020-01-01" &&
                event.target.value <= "2099-12-31"
              )
                onChange({ ...filter, reportingDate: event.target.value });
            }}
          />
        </FormField>
        {!personal && (
          <FormField label="Branch">
            <AppSelect
              value={filter.branchId}
              onChange={(event) =>
                onChange({ ...filter, branchId: event.target.value })
              }
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </AppSelect>
          </FormField>
        )}
      </div>
      <p role="status" className="text-metadata text-muted-foreground">
        Viewing {rangeLabel(filter)} · Africa/Kampala (UTC+3)
        {!personal &&
          ` · ${branches.find((b) => b.id === filter.branchId)?.name ?? "All Branches"}`}
        . “Today” refers to the selected demo date.
      </p>
    </AppCard>
  );
}
