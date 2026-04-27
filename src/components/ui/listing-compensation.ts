import {
  compensationFrequency,
  getCompensationFrequencyLabel,
  type CompensationFrequency,
} from './compensation-frequency';

const compactLakh = 100_000;
const compactCrore = 10_000_000;
const compactThousand = 1_000;

const compensationDisplayKinds = Object.freeze({
  totalPay: 'totalPay',
  fixedPay: 'fixedPay',
  stipend: 'stipend',
});

const defaultCompensationDisplayLabels = Object.freeze({
  [compensationDisplayKinds.totalPay]: 'CTC',
  [compensationDisplayKinds.fixedPay]: 'Fixed pay',
  [compensationDisplayKinds.stipend]: 'Stipend',
});

const compactFrequencyLabels = Object.freeze({
  [compensationFrequency.annual]: '/ yr',
  [compensationFrequency.monthly]: '/ mo',
  [compensationFrequency.weekly]: '/ wk',
  [compensationFrequency.daily]: '/ day',
  [compensationFrequency.hourly]: '/ hr',
  [compensationFrequency.oneTime]: 'One-time',
  [compensationFrequency.custom]: '/ custom',
});

const shortFullFrequencyLabels = Object.freeze({
  [compensationFrequency.annual]: 'per yr',
  [compensationFrequency.monthly]: 'per mo',
  [compensationFrequency.weekly]: 'per wk',
  [compensationFrequency.daily]: 'per day',
  [compensationFrequency.hourly]: 'per hr',
  [compensationFrequency.oneTime]: 'One-time',
  [compensationFrequency.custom]: 'custom',
});

const longFullFrequencyLabels = Object.freeze({
  [compensationFrequency.annual]: 'per annum',
  [compensationFrequency.monthly]: 'per month',
  [compensationFrequency.weekly]: 'per week',
  [compensationFrequency.daily]: 'per day',
  [compensationFrequency.hourly]: 'per hour',
  [compensationFrequency.oneTime]: 'One-time',
  [compensationFrequency.custom]: 'custom frequency',
});

export type CompensationFormatMode = 'compact' | 'full';
export type ListingCompensationDisplayKind =
  (typeof compensationDisplayKinds)[keyof typeof compensationDisplayKinds];
export type ListingCompensationFullFrequencyStyle = 'short' | 'long';

export type ListingPayType = Readonly<{
  frequency: CompensationFrequency;
  numberOfHours?: number | null;
}>;

export type ListingPayNode = Readonly<{
  type: ListingPayType;
  amount: number;
  currency: string;
  breakdown?: Record<string, ListingPayNode>;
}>;

export type ListingAbsolutePay = ListingPayNode;

export type ListingRangePay = Readonly<{
  type: ListingPayType;
  minValue: number;
  maxValue: number;
  currency: string;
}>;

export type PayForDisplay = ListingAbsolutePay | ListingRangePay;

export type ListingCompensation = Readonly<{
  totalPay?: PayForDisplay;
  stipend?: PayForDisplay;
}>;

export type ListingCompensationPreview = ListingCompensation &
  Readonly<{
    fixedPay?: ListingAbsolutePay;
  }>;

export type ListingCompensationDisplay = Readonly<{
  kind: ListingCompensationDisplayKind;
  label: string;
  value: string;
  frequency: CompensationFrequency;
  numberOfHours?: number;
}>;

type FrequencyFormatOptions = Readonly<{
  fullFrequencyStyle?: ListingCompensationFullFrequencyStyle;
}>;

type DisplayOptions = FrequencyFormatOptions &
  Readonly<{
    labels?: Partial<Record<ListingCompensationDisplayKind, string>>;
  }>;

type PrimaryDisplayOptions = DisplayOptions &
  Readonly<{
    listingTypeValue: string;
    internshipListingTypeValue: string;
    internshipAndFullTimeListingTypeValue: string;
  }>;

export function isRangePay(pay: PayForDisplay): pay is ListingRangePay {
  return 'minValue' in pay && 'maxValue' in pay;
}

export function isAbsolutePay(pay: PayForDisplay): pay is ListingAbsolutePay {
  return 'amount' in pay;
}

export function getPrimaryListingCompensation(
  compensation: ListingCompensationPreview | undefined,
  options: PrimaryDisplayOptions,
): ListingCompensationDisplay | null {
  if (!compensation) {
    return null;
  }

  if (options.listingTypeValue === options.internshipListingTypeValue) {
    return buildDisplay(compensationDisplayKinds.stipend, compensation.stipend);
  }

  const totalPayDisplay = buildDisplay(
    compensationDisplayKinds.totalPay,
    compensation.totalPay,
  );
  if (totalPayDisplay) {
    return totalPayDisplay;
  }

  if (compensation.fixedPay) {
    return buildDisplay(compensationDisplayKinds.fixedPay, compensation.fixedPay);
  }

  if (
    options.listingTypeValue === options.internshipAndFullTimeListingTypeValue
  ) {
    return buildDisplay(compensationDisplayKinds.stipend, compensation.stipend);
  }

  return null;

  function buildDisplay(
    kind: ListingCompensationDisplayKind,
    pay: PayForDisplay | undefined,
  ): ListingCompensationDisplay | null {
    return buildCompensationDisplay(kind, pay, 'compact', options);
  }
}

export function getListingCompensationDetails(
  compensation: ListingCompensation | undefined,
  options: DisplayOptions = {},
): ListingCompensationDisplay[] {
  const displays: ListingCompensationDisplay[] = [];

  const totalPayDisplay = buildCompensationDisplay(
    compensationDisplayKinds.totalPay,
    compensation?.totalPay,
    'full',
    options,
  );
  const stipendDisplay = buildCompensationDisplay(
    compensationDisplayKinds.stipend,
    compensation?.stipend,
    'full',
    options,
  );

  if (totalPayDisplay) {
    displays.push(totalPayDisplay);
  }

  if (stipendDisplay) {
    displays.push(stipendDisplay);
  }

  return displays;
}

export function formatListingPay(
  pay: PayForDisplay,
  mode: CompensationFormatMode,
  options: FrequencyFormatOptions = {},
): string {
  const value = formatListingPayAmount(pay, mode);
  const frequency = formatFrequency(pay.type, mode, options);

  return frequency ? `${value} ${frequency}` : value;
}

function buildCompensationDisplay(
  kind: ListingCompensationDisplayKind,
  pay: PayForDisplay | undefined,
  mode: CompensationFormatMode,
  options: DisplayOptions,
): ListingCompensationDisplay | null {
  if (!pay) {
    return null;
  }

  return {
    kind,
    label: options.labels?.[kind] ?? defaultCompensationDisplayLabels[kind],
    value: formatListingPayAmount(pay, mode),
    frequency: pay.type.frequency,
    numberOfHours: pay.type.numberOfHours ?? undefined,
  };
}

function formatListingPayAmount(
  pay: PayForDisplay,
  mode: CompensationFormatMode,
): string {
  if (isRangePay(pay)) {
    return `${formatMoney(pay.minValue, mode)} - ${formatMoney(pay.maxValue, mode)}`;
  }

  return formatMoney(pay.amount, mode);
}

function formatMoney(value: number, mode: CompensationFormatMode): string {
  if (mode === 'full') {
    return `₹ ${value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹ ${formatCompactIndianNumber(value)}`;
}

function formatCompactIndianNumber(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= compactCrore) {
    return `${trimTrailingZeroes(value / compactCrore)}Cr`;
  }

  if (absoluteValue >= compactLakh) {
    return `${trimTrailingZeroes(value / compactLakh)}L`;
  }

  if (absoluteValue >= compactThousand) {
    return `${trimTrailingZeroes(value / compactThousand)}K`;
  }

  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });
}

function trimTrailingZeroes(value: number): string {
  return value
    .toLocaleString('en-IN', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    })
    .replace(/\.0$/, '');
}

function formatFrequency(
  type: ListingPayType,
  mode: CompensationFormatMode,
  options: FrequencyFormatOptions,
): string {
  if (
    type.frequency === compensationFrequency.custom &&
    isPositiveNumber(type.numberOfHours)
  ) {
    return `for ${getCompensationFrequencyLabel(type.frequency, {
      numberOfHours: type.numberOfHours,
    })}`;
  }

  if (mode === 'compact') {
    return compactFrequencyLabels[type.frequency];
  }

  const fullFrequencyLabels =
    options.fullFrequencyStyle === 'long'
      ? longFullFrequencyLabels
      : shortFullFrequencyLabels;

  return fullFrequencyLabels[type.frequency];
}

function isPositiveNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
