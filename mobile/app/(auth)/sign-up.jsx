import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import VerifyEmailScreen from "./verify-email";

export default function SignUp() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password)
      return Alert.alert(" Error", "Please enter both email and password");

    if (password.length < 6)
      return Alert.alert(" Error", "Password must be at least 6 characters");

    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({ emailAddress: email, password });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (error) {
      console.error("SignUp error", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error",
        error?.errors?.[0]?.message ||
          error?.message ||
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification)
    return (
      <VerifyEmailScreen
        email={email}
        onBack={() => setPendingVerification(false)}
      />
    );

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "web" ? "height" : "padding"}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
            />
          </View>
          <Text style={authStyles.title}>Create Account</Text>

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
              <TouchableOpacity style={authStyles.eyeButton}>
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
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Loading..." : "Create Account"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={authStyles.linkText}>
                Already have an account?
                <Text style={authStyles.link}> Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
