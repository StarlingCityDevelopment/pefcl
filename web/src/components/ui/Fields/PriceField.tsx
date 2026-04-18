import { useConfig } from '@hooks/useConfig';
import { cn } from '@utils/cn';
import { formatMoneyWithoutCurrency, getCurrencySign, getSignLocation } from '@utils/currency';
import React, { type ChangeEventHandler } from 'react';
import { Typography } from '../Typography';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const PriceField: React.FC<Props> = ({ label, error, className, ...props }) => {
  const config = useConfig();
  const [isFocused, setIsFocused] = React.useState(false);

  const currencySignLocation = getSignLocation(config);
  const isLocationBefore = currencySignLocation === 'before';
  const currencySign = getCurrencySign(config);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = formatMoneyWithoutCurrency(Number(value), config.general.language);

    if (!value) {
      props.onChange?.(event);
      return;
    }

    const formattedEvent = {
      ...event,
      target: { ...event.target, value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>;

    props.onChange?.(formattedEvent);
  };

  return (
    <div className='flex flex-col gap-2 w-full'>
      {label && (
        <Typography variant='pre' className='text-[var(--gta-text-dim)]'>
          {label}
        </Typography>
      )}
      <div
        className={cn(
          'flex h-[48px] items-center px-4 transition-all duration-150',
          'bg-[var(--gta-surface)] border border-[var(--gta-border)]',
          'hover:border-[var(--gta-border-light)]',
          isFocused && 'border-[var(--gta-green)] shadow-[0_0_8px_var(--gta-green-glow)]',
          error && 'border-[var(--gta-red)]/50',
          className,
        )}
      >
        {isLocationBefore && (
          <span className='text-sm font-bold text-[var(--gta-green)] mr-2 select-none'>{currencySign}</span>
        )}

        <input
          {...props}
          type='text'
          value={props.value ?? ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={cn(
            'flex-1 bg-transparent border-none outline-none p-0',
            'text-base font-bold text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)]',
          )}
        />

        {!isLocationBefore && (
          <span className='text-sm font-bold text-[var(--gta-green)] ml-2 select-none'>{currencySign}</span>
        )}
      </div>
    </div>
  );
};

export default PriceField;
