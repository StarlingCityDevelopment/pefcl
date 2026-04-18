import { type Atom, useAtom } from 'jotai';
import React, { type ReactNode } from 'react';
import { cn } from '@utils/cn';

interface BadgeAtomProps {
  children: ReactNode;
  countAtom: Atom<number>;
  className?: string;
}

const BadgeAtomContent = ({ countAtom, children, className }: BadgeAtomProps) => {
  const [amount] = useAtom(countAtom);

  return (
    <div className="relative inline-flex">
      {children}
      {amount > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-white text-black text-[10px] font-bold tracking-tight transition-all duration-300",
          className
        )}>
          {amount}
        </span>
      )}
    </div>
  );
};

const BadgeAtom = ({ countAtom, children, className }: BadgeAtomProps) => {
  return (
    <React.Suspense fallback={
      <div className="relative inline-flex">
        {children}
        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-white/20 animate-pulse" />
      </div>
    }>
      <BadgeAtomContent countAtom={countAtom} className={className}>
        {children}
      </BadgeAtomContent>
    </React.Suspense>
  );
};

export default BadgeAtom;

