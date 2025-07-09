import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import SafeServiceScreen from "../components/SafeServiceScreen";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_bm90YWJsZS1pbXBhbGEtNzAuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
      navigate={() => {}}
    >
      <SafeServiceScreen>
        <Slot />
      </SafeServiceScreen>
    </ClerkProvider>
  );
}
