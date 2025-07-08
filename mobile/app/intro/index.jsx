// app/intro.jsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import thirdImage from "../../assets/images/3rd.png";
import firstImage from "../../assets/images/first.png";
import secondImage from "../../assets/images/second.png";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "Welcome to the App",
    text: "Discover amazing recipes!",
    image: firstImage,
  },
  {
    key: "2",
    title: "Search Easily",
    text: "Find your favorite food.",
    image: secondImage,
  },
  {
    key: "3",
    title: "Let’s Begin!",
    text: "Get started now.",
    image: thirdImage,
  },
];

export default function Intro() {
  const router = useRouter();

  const _renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const _renderNextButton = () => (
    <View style={styles.buttonCircle}>
      <Text style={styles.buttonText}>Next</Text>
    </View>
  );

  const _renderSkipButton = () => (
    <View style={styles.skipButton}>
      <Text style={styles.skipText}>Skip</Text>
    </View>
  );

  const _renderDoneButton = () => (
    <View style={styles.buttonCircle}>
      <Text style={styles.buttonText}>Done</Text>
    </View>
  );

  const _onDone = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    router.replace("/(tabs)/");
    console.log("Intro finished");
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={_renderItem}
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
      renderSkipButton={_renderSkipButton}
      onDone={_onDone}
      showSkipButton
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      onSkip={_onDone}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  image: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
  buttonCircle: {
    width: 80,
    height: 35,
    backgroundColor: "rgba(231, 123, 21, 0.91)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  skipText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  dotStyle: {
    backgroundColor: "#ccc",
    width: 16,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },

  activeDotStyle: {
    backgroundColor: "rgba(243, 219, 8, 0.52)",
    width: 18,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
});
