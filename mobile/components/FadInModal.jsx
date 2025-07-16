import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { homeStyles } from "../assets/styles/homes.styles";
import { COLORS } from "../constant/color";
import { HOST_URL } from "../constant/constant";

function FadeInModalContent({ onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, []);

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
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          await SecureStore.deleteItemAsync("token");
        }
      } else {
        setIsLoggedIn(false);
        await SecureStore.deleteItemAsync("token");
        router.push("/(auth)/sign-in");
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("token");
            const res = await fetch(`${HOST_URL}/api/user/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              setIsLoggedIn(false);
              await SecureStore.deleteItemAsync("token");
              const data = await res.json();
              console.log(data, "data");
            }
            console.log("✅ Sign out successful");
          } catch (error) {
            console.error("❌ Error during sign out:", error.message);
          }
        },
      },
    ]);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={homeStyles.modalOverlay}>
      <Animated.View style={[homeStyles.modalContent, animatedStyle]}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
        >
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={homeStyles.modalButton}
            onPress={() => {
              onClose();
              router.push("/createrecipe");
            }}
          >
            <Animated.Text
              entering={FadeInDown.delay(200).duration(200).springify()}
              style={homeStyles.modalButtonText}
            >
              Add Recipe
            </Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[homeStyles.modalButton, { marginTop: 15 }]}
            onPress={() => {
              onClose();
              isLoggedIn ? handleLogout() : router.push("/(auth)/sign-in");
            }}
          >
            <Animated.Text
              entering={FadeInDown.delay(300).duration(300).springify()}
              style={homeStyles.modalButtonText}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default FadeInModalContent;
