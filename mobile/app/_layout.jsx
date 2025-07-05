import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constant/color";
import SafeServiceScreen from "../components/SafeServiceScreen"
export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Current route:", router.pathname);
  }, [router.pathname]);
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={`pk_test_bm90YWJsZS1pbXBhbGEtNzAuY2xlcmsuYWNjb3VudHMuZGV2JA`}
    >
      <SafeServiceScreen >
        <Slot />
      </SafeServiceScreen>
    </ClerkProvider>
  );
}
