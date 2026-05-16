import type { ResourceConfig } from '../../../typings/config';

type FormatMoneyOptions = {
  currency: string;
  language: string;
};

const DEFAULT_OPTIONS: FormatMoneyOptions = {
  currency: 'USD',
  language: 'en-US',
};

export const formatMoney = (amount: number, options?: FormatMoneyOptions) => {
  const formatter = new Intl.NumberFormat(options?.language ?? DEFAULT_OPTIONS.language, {
    style: 'currency',
    currency: options?.currency ?? DEFAULT_OPTIONS.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

export const formatMoneyWithoutCurrency = (amount: number, language?: string) => {
  const formatter = new Intl.NumberFormat(language ?? DEFAULT_OPTIONS.language);
  return formatter.format(amount);
};

export const getSignLocation = (config?: ResourceConfig): 'before' | 'after' => {
  const formatter = new Intl.NumberFormat(config?.general?.language ?? DEFAULT_OPTIONS.language, {
    style: 'currency',
    currency: config?.general?.currency ?? DEFAULT_OPTIONS.currency,
  });

  const result = formatter.format(0);
  const isBefore = result.charAt(0) !== '0';

  return isBefore ? 'before' : 'after';
};

export const getCurrencySign = (config?: ResourceConfig): string => {
  const formatter = new Intl.NumberFormat(config?.general?.language ?? DEFAULT_OPTIONS.language, {
    style: 'currency',
    currency: config?.general?.currency ?? DEFAULT_OPTIONS.currency,
  });

  const parts = formatter.formatToParts(0);
  const currencyPart = parts.find((part) => part.type === 'currency');

  return currencyPart ? currencyPart.value : '$';
};
