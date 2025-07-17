import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { recipeCardStyles } from "../assets/styles/homes.styles";
import { recipeDetailStyles } from "../assets/styles/recipe-detail.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constant/color";

const ApproveRecipeCard = ({ recipe }) => {
  const router = useRouter();
  console.log(recipe, "recipe");
  return (
    <TouchableOpacity
      style={recipeCardStyles.adminContainer}
      onPress={() => router.push(`/adminrecipe/${recipe?.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={{ uri: recipe?.image }}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
          style={recipeDetailStyles.gradientOverlay}
        />
        {recipe?.status && (
          <View style={recipeDetailStyles.recipeStatus}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#000" }}>
              {recipe?.status.toUpperCase()}
            </Text>
          </View>
        )}
        <View style={recipeDetailStyles.floatingButtons}>
          <TouchableOpacity
            style={recipeDetailStyles.floatingButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={recipeCardStyles.imageOverlay} />
        <View style={recipeCardStyles.overlayTextContainer}>
          <Text style={recipeCardStyles.titleAdmin} numberOfLines={2}>
            {recipe?.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApproveRecipeCard;
