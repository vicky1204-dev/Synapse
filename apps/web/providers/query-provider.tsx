/**
 * QueryProvider.
 *
 * Wraps the application with TanStack QueryClientProvider.
 * The QueryClient is created once per render tree using a ref to
 * avoid recreating it on every render in React Server Component trees.
 */

"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/api/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState (not a module-level singleton) so that each test/request gets
  // its own QueryClient in SSR/test environments.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
