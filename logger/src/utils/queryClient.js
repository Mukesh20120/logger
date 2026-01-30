import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,              // retry failed requests
      staleTime: 1000 * 60,  // 1 minute
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false, // RN has no "window focus"
    },
  },
});
