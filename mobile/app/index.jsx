import './../constant/setup'
import { useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect } from "react";
import '../src/locales/i18n'

export default function Index() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Redirecting to /tabs...");
      router.replace("/(tabs)");
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}

