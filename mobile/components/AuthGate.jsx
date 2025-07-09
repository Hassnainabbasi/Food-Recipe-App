
import { useRouter, useRootNavigationState } from "expo-router";
import { useEffect } from "react";

export default function RedirectToTabs() {
  const router = useRouter();
  const navReady = useRootNavigationState();

  useEffect(() => {
    if (!navReady?.key) return;
    router.replace("/(tabs)/");
  }, [navReady]);

  return null;
}
