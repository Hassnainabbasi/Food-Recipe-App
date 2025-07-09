import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { homeStyles } from "../assets/styles/homes.styles";
import { COLORS } from "../constant/color";

function FadeInModalContent({ onClose }) {
  const { isSignedIn, signOut } = useClerk();

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
              isSignedIn ? signOut() : router.push("/(auth)/sign-in");
            }}
          >
            <Animated.Text
              entering={FadeInDown.delay(300).duration(300).springify()}
              style={homeStyles.modalButtonText}
            >
              { isSignedIn ? 'Logout' : 'Login' }
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default FadeInModalContent;
