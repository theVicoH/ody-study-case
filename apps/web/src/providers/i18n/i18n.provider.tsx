import React from "react";

import { i18n } from "@workspace/client/i18n";
import { I18nextProvider } from "react-i18next";


interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider = ({ children }: I18nProviderProps): React.JSX.Element => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export { I18nProvider };
