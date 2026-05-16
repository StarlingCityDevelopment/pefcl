import { fetchNui } from "@utils/fetchNui";
import { useEffect, useState } from 'react';
import { usePrevious } from './usePrevious';

export const useFetchNui = <T>(event: string, options?: object) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();

  const optionsString = JSON.stringify(options);
  const previous = usePrevious(optionsString);
  const hasChanged = optionsString !== previous;

  // biome-ignore lint/correctness/useExhaustiveDependencies: options object is stringified for stability
  useEffect(() => {
    if (!hasChanged && data) return;

    setIsLoading(true);
    fetchNui<T>(event, options)
      .then(setData)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [event, optionsString, hasChanged, data]);

  return { isLoading, data, error };
};
