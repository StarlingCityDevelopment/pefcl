import { Badge, BadgeProps } from '@mui/material';
import { Atom, useAtom } from 'jotai';
import React, { ReactNode } from 'react';

interface BadgeAtomProps extends BadgeProps {
  children: ReactNode;
  countAtom: Atom<number>;
}

const BadgeAtomContent = ({ countAtom, children, ...badgeProps }: BadgeAtomProps) => {
  const [amount] = useAtom(countAtom);

  return (
    <Badge badgeContent={amount} {...badgeProps}>
      {children}
    </Badge>
  );
};

const BadgeAtom = ({ countAtom, children, ...badgeProps }: BadgeAtomProps) => {
  // Ensure countAtom is not forwarded to the MUI Badge (or underlying DOM) via props spread
  return (
    <React.Suspense fallback={<Badge badgeContent={'..'} {...badgeProps} />}>
      <BadgeAtomContent countAtom={countAtom} {...badgeProps}>
        {children}
      </BadgeAtomContent>
    </React.Suspense>
  );
};

export default BadgeAtom;
