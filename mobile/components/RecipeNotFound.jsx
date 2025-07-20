import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { recipeDetailStyles } from "../assets/styles/recipe-detail.styles";
import { COLORS } from "../constant/color";

const RecipeNotFound = () => {
  const router = useRouter();
  const recipeDetailFileStyles = recipeDetailStyles();

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.background]}
      style={recipeDetailFileStyles.errorContainer}
    >
      <View style={recipeDetailFileStyles.errorContent}>
        <Ionicons name="restaurant-outline" size={80} color={COLORS.white} />
        <Text style={recipeDetailFileStyles.errorTitle}>Recipe not found</Text>
        <Text style={recipeDetailFileStyles.errorDescription}>
          Sorry, we couldn&apos;t find this recipe. Please try again.
        </Text>
        <TouchableOpacity
          style={recipeDetailFileStyles.errorButton}
          onPress={() => router.back()}
        >
          <Text style={recipeDetailFileStyles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
export default RecipeNotFound;
