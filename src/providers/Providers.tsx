'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // Disable retries
          retry: false,
          // Disable refetching on mount
          refetchOnMount: false,
          // Disable refetching on window focus
          refetchOnWindowFocus: false,
          // Disable refetching on reconnect
          refetchOnReconnect: false,
          // Increase stale time
          staleTime: 5 * 60 * 1000,
        },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}