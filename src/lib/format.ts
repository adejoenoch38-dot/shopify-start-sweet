export function formatPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return amount;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

export function discountPercent(
  price: string,
  compareAt: string | undefined,
): number | null {
  const p = parseFloat(price);
  const c = compareAt ? parseFloat(compareAt) : NaN;
  if (!Number.isNaN(c) && c > p && c > 0) {
    return Math.round((1 - p / c) * 100);
  }
  return null;
}
