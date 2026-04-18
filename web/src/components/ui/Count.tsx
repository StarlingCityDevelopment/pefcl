import React from 'react';
import { cn } from '@utils/cn';

interface CountProps extends React.HTMLAttributes<HTMLDivElement> {
 amount: string | number;
 focus?: boolean;
}

const Count: React.FC<CountProps> = ({ amount, focus = false, className, ...props }) => {
 return (
 <div
 className={cn(
 "flex justify-center items-center text-center",
 "h-12 min-w-[3rem] px-2 rounded-xl",
 "font-black text-sm transition-all duration-300",
 "bg-white/[0.03] border border-white/10 text-slate-400",
 focus && "bg-white/[0.08] border-white/30 text-white scale-105 -[0_0_20px_rgba(255,255,255,0.05)]",
 className
 )}
 {...props}
 >
 {amount}
 </div>
 );
};

export default Count;
