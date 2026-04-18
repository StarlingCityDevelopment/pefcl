import { fetchNui } from '@utils/fetchNui';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
  successMessage?: string;
}

/**
 * A hook for handling NUI mutations (POST requests with side effects).
 * Manages loading state, error handling, and provides snackbar notifications.
 */
export const useMutation = <T = unknown, I = unknown>(event: string, options?: MutationOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const mutate = async (data?: I) => {
    setIsLoading(true);
    try {
      const response = await fetchNui<T, I>(event, data);

      if (options?.successMessage) {
        enqueueSnackbar(options.successMessage, { variant: 'success' });
      }

      if (options?.onSuccess) {
        options.onSuccess(response as T);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });

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
