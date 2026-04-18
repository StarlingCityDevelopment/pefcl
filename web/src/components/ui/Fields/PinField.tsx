import { PIN_CODE_LENGTH } from '@common/constants';
import React, { type ChangeEvent, useState } from 'react';
import Count from '../Count';
import { Typography } from '../Typography';

interface PinFieldProps {
 label?: string;
 value: string;
 onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PinField = ({ onChange, value, label }: PinFieldProps) => {
 const [hasFocus, setHasFocus] = useState(false);

 const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
 const newValue = event.target.value;
 const newLength = newValue.length;

 if (newValue && isNaN(Number.parseInt(newValue, 10))) {
 return;
 }

 if (newLength > PIN_CODE_LENGTH && value.length < newLength) {
 return;
 }

 onChange?.(event);
 };

 const codeLen = new Array(PIN_CODE_LENGTH).fill('');

 return (
 <div className="flex flex-col gap-2">
 {label && (
 <Typography variant="pre" className="text-slate-500">
 {label}
 </Typography>
 )}
 <div className="relative grid grid-cols-4 gap-3 w-fit">
 <input
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
 onChange={handleChange}
 value={value || ''}
 onBlur={() => setHasFocus(false)}
 onFocus={() => setHasFocus(true)}
 autoFocus
 />

 {codeLen.map((_val, index) => (
 <Count 
 key={index} 
 amount={value[index] ? '•' : ''} 
 focus={hasFocus && (value.length === index || (index === PIN_CODE_LENGTH - 1 && value.length === PIN_CODE_LENGTH))} 
 />
 ))}
 </div>
 </div>
 );
};

export default PinField;
