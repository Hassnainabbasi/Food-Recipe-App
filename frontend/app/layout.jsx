import { Slot } from "expo-router";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/locales/i18n";

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <Slot />
    </I18nextProvider>
  );
}
