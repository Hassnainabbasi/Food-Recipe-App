import { Redirect, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function AuthRoutesLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const res = await fetch(`${HOST_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setIsLoggedIn(true);
          <Redirect href={"/"} />;
        } else {
          setIsLoggedIn(false);
          await SecureStore.deleteItemAsync("token");
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
