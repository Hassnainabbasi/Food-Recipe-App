import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constant/color";
import { ADMIN_EMAIL, HOST_URL } from "../../constant/constant";

export default function SignIn() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const respone = await fetch(`${HOST_URL}/api/user/signin`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (respone.ok) {
        const data = await respone.json();
        console.log(data);
        if (data?.token) {
          await SecureStore.setItemAsync("token", data.token);
          console.log("Token saved successfully.");
        }
        if (email === ADMIN_EMAIL && password === "@Sing1412") {
          router.replace("/(admin)/");
        } else {
          router.replace("/(tabs)/");
        }
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (e) {
      console.error("Sign-in error", e);
      Alert.alert(
        "Sign In Error",
        e?.errors?.[0]?.message || e.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    <Redirect href={"/"} />;
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "web" ? "height" : "padding"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
            />
            <Text style={authStyles.title}>Welcome Back</Text>

            <View style={authStyles.formContainer}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Email"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Password"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="none"
                  secureTextEntry={!showpassword}
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowPassword(!showpassword)}
                >
                  <Ionicons
                    name={showpassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  loading && authStyles.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.push("/(auth)/sign-up")}
              >
                <Text style={authStyles.linkText}>
                  Don't have an account?
                  <Text style={authStyles.link}> Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
