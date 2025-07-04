import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  console.log("TabsLayout - isLoaded:", isLoaded, "isSignedIn:", isSignedIn);

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
