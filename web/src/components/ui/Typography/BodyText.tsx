import React from 'react';
import { cn } from '@utils/cn';

interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const PreHeading: React.FC<BodyTextProps> = ({ className, ...props }) => (
  <p className={cn("text-[0.8125rem] font-normal leading-relaxed text-white/60", className)} {...props} />
);

export const BodyText: React.FC<BodyTextProps> = ({ className, ...props }) => (
  <p className={cn("text-[0.9375rem] font-normal leading-relaxed text-white/90", className)} {...props} />
);

