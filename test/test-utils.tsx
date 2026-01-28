import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createTestQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            retry: false,
         },
         mutations: {
            retry: false,
         },
      },
   });
}

function Providers({ children }: PropsWithChildren) {
   const client = createTestQueryClient();
   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function renderWithProviders(
   ui: React.ReactElement,
   options?: Omit<RenderOptions, "wrapper">
) {
   return render(ui, { wrapper: Providers, ...options });
}

export * from "@testing-library/react";
