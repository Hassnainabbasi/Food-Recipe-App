import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { HOST_URL } from "../../constant/constant";
import { BASE_URL, Fav_URL, MealApi, WEB_URL } from "../../services/mealApi";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";

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
        setRecipe(mealData);
      } catch (error) {
        console.log(error.message, "loadDetail ka ");
      } finally {
        setLoading(false);
      }
    };
    checkIfSaved();
    loadRecipeDetail();
    console.log(recipe, "this is recipe is userki dynamic");
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
  console.log(recipe, "yeh user ki id i hy");

  const recipeDetailStyleFile = recipeDetailStyles(recipe)
  return (
    <View style={recipeDetailStyleFile.container}>
      <ScrollView>
        <View style={recipeDetailStyleFile.headerContainer}>
          <View style={recipeDetailStyleFile.imageContainer}>
            <Image
              source={{ uri: recipe?.image }}
              style={recipeDetailStyleFile.headerImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
              style={recipeDetailStyleFile.gradientOverlay}
            />
          </View>
          <View style={recipeDetailStyleFile.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyleFile.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                recipeDetailStyleFile.floatingButton,
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
          <View style={recipeDetailStyleFile.titleSection}>
            <View style={recipeDetailStyleFile.categoryBadge}>
              <Text style={recipeDetailStyleFile.categoryText}>
                {recipe?.category}
              </Text>
            </View>

            <Text style={recipeDetailStyleFile.recipeTitle}>
              {" "}
              {recipe?.title_json?.[lang] || recipe?.title}
            </Text>
            {recipe?.area && (
              <View style={recipeDetailStyleFile.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={recipeDetailStyleFile.locationText}>
                  {recipe?.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={recipeDetailStyleFile.contentSection}>
          <View style={recipeDetailStyleFile.statsContainer}>
            <View style={recipeDetailStyleFile.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyleFile.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyleFile.statValue}>
                {recipe?.cookTime}
              </Text>
              <Text style={recipeDetailStyleFile?.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyleFile.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyleFile.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyleFile.statValue}>
                {recipe?.servings}
              </Text>
              <Text style={recipeDetailStyleFile.statLabel}>Servings</Text>
            </View>
          </View>
          <View style={recipeDetailStyleFile.sectionContainer}>
            <View style={recipeDetailStyleFile.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyleFile.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyleFile.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyleFile.countBadge}>
                <Text style={recipeDetailStyleFile.countText}>
                  {recipe?.ingredients?.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={recipeDetailStyleFile.ingredientsGrid}>
            {recipe?.ingredients?.map((ing, index) => (
              <View key={ing} style={recipeDetailStyleFile.ingredientCard}>
                <View style={recipeDetailStyleFile.ingredientNumber}>
                  <Text style={recipeDetailStyleFile.ingredientNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={recipeDetailStyleFile.ingredientText}>
                  {ing?.[lang] || ing?.en || ing}
                </Text>
                <View style={recipeDetailStyleFile.ingredientCheck}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={COLORS.textLight}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={recipeDetailStyleFile.instructionTitle}>
            <View style={recipeDetailStyleFile.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyleFile.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyleFile.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyleFile.countBadge}>
                <Text style={recipeDetailStyleFile.countText}>
                  {recipe?.instructions?.length}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyleFile.instructionsContainer}>
              <View style={recipeDetailStyleFile.instructionCard}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary + "CC"]}
                  style={recipeDetailStyleFile.stepIndicator}
                >
                  <Text style={recipeDetailStyleFile?.stepNumber}>1</Text>
                </LinearGradient>
                <View style={recipeDetailStyleFile.instructionContent}>
                  <Text style={recipeDetailStyleFile.instructionText}>
                    {recipe?.instructions_json?.[lang] || recipe?.instructions}
                  </Text>
                  <View style={recipeDetailStyleFile.instructionFooter}>
                    <Text style={recipeDetailStyleFile.stepLabel}>Step 1</Text>
                    <TouchableOpacity style={recipeDetailStyleFile.completeButton}>
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
            style={recipeDetailStyleFile.primaryButton}
            onPress={handleToggleSaved}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyleFile.buttonGradient}
            >
              <Ionicons name="heart" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyleFile.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
