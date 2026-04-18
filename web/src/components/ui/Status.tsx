import React from 'react';
import { cn } from '@utils/cn';

type StatusColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

interface StatusProps {
  label: string;
  color: StatusColor;
  className?: string;
}

const colorMap: Record<StatusColor, string> = {
  default: "text-white/60 bg-white/5 border-white/10",
  primary: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  secondary: "text-white/60 bg-white/5 border-white/10",
  error: "text-red-400 bg-red-500/10 border-red-500/20",
  info: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const Status: React.FC<StatusProps> = ({ label, color, className }) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[0.625rem] font-black uppercase tracking-widest italic leading-none transition-all",
        colorMap[color],
        className
      )}
    >
      {label}
    </div>
  );
};

export default Status;

