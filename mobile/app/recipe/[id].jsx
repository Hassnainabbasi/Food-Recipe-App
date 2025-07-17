import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { BASE_URL, Fav_URL, MealApi, WEB_URL } from "../../services/mealApi";
import * as SecureStore from "expo-secure-store";
import { HOST_URL } from "../../constant/constant";

export default function RecipeDetailPage() {
  const { id: recipeId } = useLocalSearchParams();
  console.log(recipeId);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const userId = user?.id;
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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
          const data = await res.json();
          console.log(data,'this data new user recipe')
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          await SecureStore.deleteItemAsync("token");
        }
      } else {
        setIsLoggedIn(false);
        await SecureStore.deleteItemAsync("token");
        router.push("/(auth)/sign-in");
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (!recipeId) return;
    console.log(recipe?.youtubeUrl);

    getYoutubeUrl();
    const checkIfSaved = async () => {
      try {
        const response = await fetch(
          `${WEB_URL || BASE_URL}/favorites/${userId}`
        );
        const data = await response.json();
        const savedRecipeIds = data.some(
          (fav) => fav.recipeId === parseInt(recipeId)
        );
        setIsSaved(savedRecipeIds);
      } catch (error) {
        console.log(error.message, "chexk ka");
      } finally {
        setLoading(false);
      }
    };
    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const mealData = await MealApi.getMealById(recipeId);
        console.log(mealData, "meal data");
        setRecipe(mealData);
      } catch (error) {
        console.log(error.message, "loadDetail ka ");
      } finally {
        setLoading(false);
      }
    };
    checkIfSaved();
    loadRecipeDetail();
  }, [recipeId, userId]);

  const getYoutubeUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) return null;
    const urls = `https://www.youtube.com/embed/${videoId}`;
    console.log(urls, "youtube ka");
    return urls;
  };

  const handleToggleSaved = async () => {
    setIsSaving(true);
    if (isSaved) {
      const res = await fetch(`${Fav_URL}/favorites/${userId}/${recipeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove recipe");
      setIsSaved(false);
    } else {
      try {
        const data = {
          userId,
          recipeId: Number(recipeId),
          title: recipe.title,
          image: recipe.image,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
        };
        console.log(data, "this data");
        const res = await fetch(`${Fav_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to add recipe");
        setIsSaved(true);
      } catch (error) {
        console.log(error.message);
        Alert.alert(" Error", "Failed to save recipe");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe?.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
              style={recipeDetailStyles.gradientOverlay}
            />
          </View>
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
              ]}
              onPress={handleToggleSaved}
              disabled={isSaving}
            >
              <Ionicons
                name={
                  isSaving
                    ? "hourglass"
                    : isSaved
                    ? "bookmark"
                    : "bookmark-outline"
                }
                color={COLORS.white}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe?.category}
              </Text>
            </View>

            <Text style={recipeDetailStyles.recipeTitle}>
              {" "}
              {recipe?.title_json?.[lang] || recipe?.title}
            </Text>
            {recipe?.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe?.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={recipeDetailStyles.contentSection}>
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe?.cookTime}
              </Text>
              <Text style={recipeDetailStyles?.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe?.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe?.ingredients?.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={recipeDetailStyles.ingredientsGrid}>
            {recipe?.ingredients?.map((ing, index) => (
              <View key={ing} style={recipeDetailStyles.ingredientCard}>
                <View style={recipeDetailStyles.ingredientNumber}>
                  <Text style={recipeDetailStyles.ingredientNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={recipeDetailStyles.ingredientText}>
                  {ing?.[lang] || ing?.en || ing}
                </Text>
                <View style={recipeDetailStyles.ingredientCheck}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={COLORS.textLight}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={recipeDetailStyles.instructionTitle}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe?.instructions?.length}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyles.instructionsContainer}>
              <View style={recipeDetailStyles.instructionCard}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary + "CC"]}
                  style={recipeDetailStyles.stepIndicator}
                >
                  <Text style={recipeDetailStyles?.stepNumber}>1</Text>
                </LinearGradient>
                <View style={recipeDetailStyles.instructionContent}>
                  <Text style={recipeDetailStyles.instructionText}>
                    {recipe?.instructions_json?.[lang] || recipe?.instructions}
                  </Text>
                  <View style={recipeDetailStyles.instructionFooter}>
                    <Text style={recipeDetailStyles.stepLabel}>Step 1</Text>
                    <TouchableOpacity style={recipeDetailStyles.completeButton}>
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSaved}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons name="heart" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
