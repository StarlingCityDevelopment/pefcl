// web/src/hooks/useMutation.ts
import { fetchNui } from "@utils/fetchNui";
import { createSignal } from 'solid-js';

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
  successMessage?: string;
}

/**
 * A hook for handling NUI mutations (POST requests with side effects).
 * Manages loading state and error handling.
 */
export const useMutation = <T = unknown, I = unknown>(event: string, options?: MutationOptions<T>) => {
  const [isLoading, setIsLoading] = createSignal(false);

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
