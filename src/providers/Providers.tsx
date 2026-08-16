"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { CartSidebar } from "@/components/cart/CartSidebar";

// Query client configuration optimized for e-commerce + SSR
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR: Don't refetch immediately on client
        staleTime: 60 * 1000, // 1 minute - data is fresh
        // Cache time for inactive queries
        gcTime: 5 * 60 * 1000, // 5 minutes
        // Retry configuration
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch settings
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Singleton for browser - prevents recreating client on every render
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: reuse the same query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Use a stable query client that persists across renders
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <CartSidebar />
    </QueryClientProvider>
  );
}
