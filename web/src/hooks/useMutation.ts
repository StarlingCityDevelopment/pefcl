import { fetchNui } from '@utils/fetchNui';
import { useState } from 'react';

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
  successMessage?: string;
}

/**
 * A hook for handling NUI mutations (POST requests with side effects).
 * Manages loading state and error handling.
 * TODO: Implement a custom monochrome notification system to replace notistack.
 */
export const useMutation = <T = unknown, I = unknown>(event: string, options?: MutationOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data?: I) => {
    setIsLoading(true);
    try {
      const response = await fetchNui<T, I>(event, data);

      if (options?.onSuccess) {
        options.onSuccess(response as T);
      }

      return response;
    } catch (err: any) {
      if (options?.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};
