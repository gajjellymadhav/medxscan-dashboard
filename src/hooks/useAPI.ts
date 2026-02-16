import { useState, useCallback } from 'react';

interface UseAPIState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useAPI<T>(
  apiCall: (...args: any[]) => Promise<{ success: boolean; data: T | null; error: string | null }>,
  options?: UseAPIOptions<T>
) {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, error: null, isLoading: true, isSuccess: false });

      try {
        const response = await apiCall(...args);

        if (response.success && response.data) {
          setState({ data: response.data, error: null, isLoading: false, isSuccess: true });
          options?.onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMsg = response.error || 'An unexpected error occurred';
          setState({ data: null, error: errorMsg, isLoading: false, isSuccess: false });
          options?.onError?.(errorMsg);
          return null;
        }
      } catch (err: any) {
        const errorMsg = err.message || 'Network error. Please check your connection.';
        setState({ data: null, error: errorMsg, isLoading: false, isSuccess: false });
        options?.onError?.(errorMsg);
        return null;
      }
    },
    [apiCall, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false, isSuccess: false });
  }, []);

  return { ...state, execute, reset };
}
