import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { recipeCardStyles } from "../assets/styles/homes.styles";
import { COLORS } from "../constant/color";

const FavoriteRecipeCard = ({ recipe, getLocalized, lang }) => {
  console.log("recipe", recipe?.title, recipe);
  const router = useRouter();
  return (
    <TouchableOpacity
      style={recipeCardStyles.containerDetail}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainerDetail}>
        <Image
          source={{ uri: recipe?.image }}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={recipeCardStyles.contentDetail}>
        <Text style={recipeCardStyles.title} numberOfLines={2}>
            {recipe?.title}
        </Text>
        <View style={recipeCardStyles.footer}>
          {recipe?.cookTime && (
            <View style={recipeCardStyles.timeContainer}>
              <Ionicons
                name="time-outline"
                size={14}
                color={COLORS.textLight}
              />
              <Text style={recipeCardStyles.timeText}>{recipe?.cookTime}</Text>
            </View>
          )}
          {recipe?.servings && (
            <View style={recipeCardStyles.servingsContainer}>
              <Ionicons
                name="people-outline"
                size={14}
                color={COLORS.textLight}
              />
              <Text style={recipeCardStyles.servingsText}>
                {recipe?.servings}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteRecipeCard;
