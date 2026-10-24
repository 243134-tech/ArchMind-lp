/**
 * ArchMind Indian Rupee & Number Formatters
 * Formats currency values in Indian Rupees (₹) adhering to Indian numbering conventions.
 */

export function formatINR(
  amount: number | undefined | null,
  options?: {
    compact?: boolean;
    showDecimals?: boolean;
    showSymbol?: boolean;
  }
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return options?.showSymbol !== false ? '₹0' : '0';
  }

  const { compact = false, showDecimals = false, showSymbol = true } = options || {};
  const symbol = showSymbol ? '₹' : '';

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      // 1 Crore = 100 Lakhs = 10,000,000
      const cr = amount / 10000000;
      return `${symbol}${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lk = amount / 100000;
      return `${symbol}${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(1)} Lakhs`;
    }
    if (abs >= 1000) {
      const k = amount / 1000;
      return `${symbol}${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
    }
  }

  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: showDecimals ? 2 : 0,
      minimumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);
    return `${symbol}${formatted}`;
  } catch {
    return `${symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Format general numbers with Indian comma separators
 */
export function formatIndianNumber(value: number): string {
  try {
    return new Intl.NumberFormat('en-IN').format(value);
  } catch {
    return value.toLocaleString();
  }
}
