import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
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

export default function VerifyEmailScreen({ email, onBack }) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const handleVerification = async () => {
    setLoading(true);
    try {
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        return;
      }

      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        Alert.alert("Error", "Verification failed");
      }
    } catch (err) {
      const code = err?.errors?.[0]?.code;

      if (code === "verification_already_verified") {
        if (signUp.status === "complete") {
          await setActive({ session: signUp.createdSessionId });
          console.log("signUp.status:", signUp.status);
          console.log("signUp.createdSessionId:", signUp.createdSessionId);

          return;
        } else {
          Alert.alert(
            "Already Verified",
            "Email pehle se verify ho chuki hai. Try logging in."
          );
        }
      } else {
        console.error("SignUp error", err);
        console.log("Full error object", JSON.stringify(err, null, 2));

        Alert.alert(
          "Error",
          err?.errors?.[0]?.message || err?.message || "Failed to verify email"
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
              style={authStyles.image}
              source={require("../../assets/images/i3.png")}
              contentFit={"contain"}
            />
          </View>
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We have sent a verification code to {email}
          </Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Loading" : "Verfiy Email"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
