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
        <Typography variant='pre' className='text-slate-500'>
          {label}
        </Typography>
      )}
      <div
        className={cn(
          'flex min-h-[52px] items-center px-4 rounded-2xl transition-all duration-300',
          'bg-white/[0.03] border border-white/5',
          'hover:bg-white/[0.05] hover:border-white/10',
          isFocused && 'bg-white/[0.02] border-white ring-1 ring-white/10 -[0_0_20px_rgba(255,255,255,0.05)]',
          error && 'border-red-500/50 bg-red-500/[0.02]',
          className,
        )}
      >
        {isLocationBefore && <span className='text-sm font-black text-white/40 mr-2 select-none'>{currencySign}</span>}

        <input
          {...props}
          type='text'
          value={props.value ?? ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={cn(
            'flex-1 bg-transparent border-none outline-none p-0',
            'text-base font-bold text-white placeholder:text-slate-700',
            'tracking-tight',
          )}
        />

        {!isLocationBefore && <span className='text-sm font-black text-white/40 ml-2 select-none'>{currencySign}</span>}
      </div>
    </div>
  );
};

export default PriceField;
