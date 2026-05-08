import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/providers/query/query.client";

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: QueryProviderProps): React.JSX.Element => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { QueryProvider };
