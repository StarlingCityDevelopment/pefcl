import { cn } from '@utils/cn';
import * as React from 'react';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('animate-pulse bg-[var(--gta-surface)]', className)} {...props} />;
};

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border border-[var(--gta-border)] bg-[var(--gta-panel)] text-[var(--gta-text)]', className)}
    {...props}
  />
));
Card.displayName = 'Card';

export { Skeleton, Card };
