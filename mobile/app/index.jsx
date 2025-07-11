import { useNavigationContainerRef, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Redirecting to /tabs...");
      router.replace("/(tabs)");
    }, 100); // ⏳ Small delay ensures mounting is done

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
