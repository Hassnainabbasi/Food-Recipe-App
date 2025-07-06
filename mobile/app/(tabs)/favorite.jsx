import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { favoritesStyles } from "../../assets/styles/favorties.styles";
import RecipeCard from "../../components/RecipeCard";
import RecipeNotFound from "../../components/RecipeNotFound";
import { ApiUrl } from "../../constant/api";
import { COLORS } from "../../constant/color";
import NoFavoritesFound from "../../components/FavoriteNotFound";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function FavoriteScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoritesRecipe, setFavoritesRecipe] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch(`${ApiUrl}/favorites/${user.id}`);
        if (!res.ok) throw new Error("Failed to load favorites");
        const data = await res.json();

        const transformedFavorites = data.map((recipe) => ({
          ...recipe,
          id: recipe.recipeId,
        }));

        setFavoritesRecipe(transformedFavorites);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user.id]);

  const handleSignOut = async () => {
   Alert.alert("Logout", "Are you sure you want to logout?",[
    { text: "Cancel", style:"cancel" },
    { text: "Logout", style: "destructive", onPress: signOut }
   ])
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoritesRecipe}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={favoritesStyles.recipesGrid}
            ListEmptyComponent={<NoFavoritesFound />}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View> 
  );
}
