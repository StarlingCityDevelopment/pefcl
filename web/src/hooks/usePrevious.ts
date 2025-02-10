import { useEffect, useRef } from 'react';

export const usePrevious = (value: unknown) => {
  const ref = useRef<unknown>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
