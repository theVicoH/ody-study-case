import React from "react";

import { I18nProvider } from "@/providers/i18n/i18n.provider";
import { QueryProvider } from "@/providers/query/query.provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps): React.JSX.Element => (
  <QueryProvider>
    <I18nProvider>{children}</I18nProvider>
  </QueryProvider>
);
