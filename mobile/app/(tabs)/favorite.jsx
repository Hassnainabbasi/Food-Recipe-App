import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { favoritesStyles } from "../../assets/styles/favorties.styles";
import NoFavoritesFound from "../../components/FavoriteNotFound";
import FavoriteRecipeCard from "../../components/FavoriteRecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { Fav_URL } from "../../services/mealApi";

export const getLocalized = (obj, key, lang = "en") => {
  if (!obj || !obj[`${key}_json`]) return obj[key] || "";
  return obj[`${key}_json`][lang] || obj[key];
};

export default function FavoriteScreen() {
  const { signOut, isSignedIn } = useClerk();
  const { user } = useUser();
  const [favoritesRecipe, setFavoritesRecipe] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!isSignedIn || !user) {
      router.replace("/(auth)/sign-in");
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${Fav_URL}/favorites/${user?.id}`);
        if (!res.ok) throw new Error("Failed to load favorites");
        const data = await res.json();

        const transformedFavorites = data?.favorites?.map((recipe) => ({
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
  }, [user?.id]);

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("⏳ Signing out...");
            await AsyncStorage.removeItem("introSeen");

            await signOut();

            console.log("✅ Sign out successful");

            router.replace("/(auth)/sign-in");
          } catch (error) {
            console.error("❌ Error during sign out:", error);
          }
        },
      },
    ]);
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
            renderItem={({ item }) => (
              <FavoriteRecipeCard
                getLocalized={getLocalized}
                lang={lang}
                recipe={item}
              />
            )}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            keyExtractor={(item) => item?.id?.toString()}
            contentContainerStyle={favoritesStyles.recipesGrid}
            ListEmptyComponent={<NoFavoritesFound />}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}
