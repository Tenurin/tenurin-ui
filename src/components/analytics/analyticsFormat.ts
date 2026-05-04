import { format } from 'date-fns';

const compactThousand = 1_000;
const compactLakh = 100_000;
const compactCrore = 10_000_000;

const countFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const compactIndianNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const currencyAmountFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatAnalyticsCount(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return countFormatter.format(value);
}

export function formatAnalyticsCurrency(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return `₹ ${formatCompactIndianNumber(value)}`;
}

export function formatAnalyticsCurrencyAmount(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return `₹ ${currencyAmountFormatter.format(value)}`;
}

export function formatAnalyticsDecimal(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return decimalFormatter.format(value);
}

export function formatAnalyticsPercent(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return `${percentFormatter.format(value)}%`;
}

export function formatAnalyticsRatioAsPercent(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return formatAnalyticsPercent(value * 100);
}

export function formatAnalyticsSnapshotTimestamp(
  value: string | undefined,
): string {
  if (value === undefined || value.length === 0) {
    return 'Not available';
  }

  return format(new Date(value), 'MMM d, yyyy, h:mm a');
}

function formatCompactIndianNumber(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= compactCrore) {
    return `${formatCompactUnit(value / compactCrore)} Cr`;
  }

  if (absoluteValue >= compactLakh) {
    return `${formatCompactUnit(value / compactLakh)} L`;
  }

  if (absoluteValue >= compactThousand) {
    return `${formatCompactUnit(value / compactThousand)} K`;
  }

  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });
}

function formatCompactUnit(value: number): string {
  return compactIndianNumberFormatter.format(value);
}
