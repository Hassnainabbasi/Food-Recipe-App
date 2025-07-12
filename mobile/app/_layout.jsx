import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import SafeServiceScreen from "../components/SafeServiceScreen";
import "../src/locales/i18n";

export default function RootLayout() {
  const { i18n, t } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ur" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <ClerkProvider
      publishableKey="pk_test_bm90YWJsZS1pbXBhbGEtNzAuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
      navigate={() => {}}
    >
      <I18nextProvider i18n={i18n}>
        <SafeServiceScreen>
          <Slot />
        </SafeServiceScreen>
      </I18nextProvider>
    </ClerkProvider>
  );
}
