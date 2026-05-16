import { cn } from "@utils/cn";
import type React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const Heading1: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h1 className={cn('text-[2.5rem] font-semibold tracking-tighter leading-[1.15] text-white', className)} {...props} />
);

export const Heading2: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h2 className={cn('text-[1.75rem] font-semibold tracking-tight leading-normal text-white', className)} {...props} />
);

export const Heading3: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h3 className={cn('text-[1.375rem] font-semibold tracking-tight leading-relaxed text-white', className)} {...props} />
);

export const Heading4: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h4 className={cn('text-lg font-medium tracking-tight leading-snug text-white', className)} {...props} />
);

export const Heading5: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h5 className={cn('text-[0.9375rem] font-medium leading-relaxed text-white/60', className)} {...props} />
);

export const Heading6: React.FC<HeadingProps> = ({ className, ...props }) => (
  <h6
    className={cn('text-[0.75rem] font-medium tracking-wider leading-relaxed text-white/60 uppercase', className)}
    {...props}
  />
);
