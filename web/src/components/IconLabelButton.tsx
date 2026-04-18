import React from 'react';
import { cn } from '@utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
  children?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, icon, className, ...props }) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-1.5 bg-[#d84e4b] text-white rounded-lg font-medium text-base transition-all hover:bg-[#c44341] active:scale-95",
        className
      )}
      {...props}
    >
      {children}
      <span className="shrink-0">{icon}</span>
    </button>
  );
};

interface IconLabelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement;
  children: React.ReactNode;
}

const IconLabelButton: React.FC<IconLabelButtonProps> = ({ children, icon, className, ...props }) => (
  <button 
    className={cn(
      "inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold uppercase italic tracking-tighter transition-all hover:bg-white/95 active:scale-[0.98]",
      className
    )}
    {...props}
  >
    {children}
    <span className="shrink-0">{icon}</span>
  </button>
);

export default IconLabelButton;
