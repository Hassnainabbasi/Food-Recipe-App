import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { recipeCardStyles } from "../assets/styles/homes.styles";

const AdminRecipeCard = ({ recipe }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={recipeCardStyles.imageOverlay} />
        <View style={recipeCardStyles.overlayTextContainer}>
          <Text style={recipeCardStyles.titleAdmin} numberOfLines={2}>
            {recipe.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AdminRecipeCard;
