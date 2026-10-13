import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
};

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...options
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
