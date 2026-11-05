const ugxFormatter = new Intl.NumberFormat("en-UG", {
  style: "currency",
  currency: "UGX",
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** UGX is displayed as whole shillings. Fractional inputs are rounded for display. */
export function formatUGX(amount: number): string {
  if (!Number.isFinite(amount))
    throw new RangeError("A UGX amount must be finite.");
  return ugxFormatter.format(amount);
}
