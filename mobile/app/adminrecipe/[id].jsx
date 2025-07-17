import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { HOST_URL } from "../../constant/constant";
import { MealApi } from "../../services/mealApi";

export default function RecipeDetailPage() {
  const { id: recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const userId = user?.id;

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
    if (!userId || !recipeId) return;

    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const mealData = await MealApi.getMealByAdminId(recipeId);
        // console.log(recipeId, "recipeID");
        if (mealData) {
          const tranformData = MealApi.transformMealData(mealData);
          setRecipe(tranformData);
          console.log(tranformData, "transfromData"); 
        }
      } catch (error) {
        console.log(error.message, "loadDetail ka ");
      } finally {
        setLoading(false);
      }
    };
    loadRecipeDetail();
  }, [recipeId, userId]);

  const handleApprove = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancel = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
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
          </View>
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe?.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe?.title}</Text>
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
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
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
                  {recipe.ingredients.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={recipeDetailStyles.ingredientsGrid}>
            {recipe?.ingredients.map((ing, index) => (
              <View key={ing} style={recipeDetailStyles.ingredientCard}>
                <View style={recipeDetailStyles.ingredientNumber}>
                  <Text style={recipeDetailStyles.ingredientNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={recipeDetailStyles.ingredientText}>{ing}</Text>
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
                  {recipe.instructions}
                </Text>
              </View>
            </View>
            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe?.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={recipeDetailStyles.completeButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
