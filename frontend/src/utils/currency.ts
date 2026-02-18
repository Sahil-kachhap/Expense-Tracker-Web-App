const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format amount in cents to INR currency string
 */
export function formatCurrency(amountInCents: number): string {
  return formatter.format(amountInCents / 100);
}
