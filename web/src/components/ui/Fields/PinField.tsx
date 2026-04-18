import { PIN_CODE_LENGTH } from '@common/constants';
import React, { type ChangeEvent, useRef } from 'react';
import Count from '../Count';
import { Typography } from '../Typography';

interface PinFieldProps {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const PinField = ({ onChange, value, label, isLoading }: PinFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pinIndices = Array.from({ length: PIN_CODE_LENGTH }, (_, i) => i);

  return (
    <div className='flex flex-col gap-4 w-full'>
      {label && (
        <Typography variant='pre' className='text-slate-500'>
          {label}
        </Typography>
      )}
      <div className='flex items-center justify-center gap-3 relative'>
        <input
          ref={inputRef}
          type='number'
          value={value}
          onChange={onChange}
          onBlur={() => inputRef.current?.focus()}
          // biome-ignore lint/a11y/noAutofocus: Autofocus is required for NUI hardware terminal simulation
          autoFocus
          className='absolute inset-0 opacity-0 cursor-default digit-input'
        />

        {pinIndices.map((index) => (
          <Count
            key={index}
            amount={value[index] ? '•' : ''}
            focus={
              (value.length === index || (index === PIN_CODE_LENGTH - 1 && value.length === PIN_CODE_LENGTH)) &&
              !isLoading
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PinField;
