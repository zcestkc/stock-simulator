export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const formatSigned = (value: number, suffix = '') =>
  `${value > 0 ? '+' : ''}${value.toFixed(2)}${suffix}`;

// Up to 6 decimals for fractional shares, without trailing zeros.
export const formatShares = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
