import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles.js";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { HOST_URL } from "../../constant/constant";
import { MealApi } from "../../services/mealApi";

export default function AdminRecipeDetailPage() {
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
    if (recipe) {
      console.log(recipe, "this recipe admin recipe");
    }
    checkToken();
  }, [recipe]);

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

  const updateStatus = async (status) => {
    setIsSaving(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch(`${HOST_URL}/api/admin/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recipeId, status }),
      });
      console.log(res, "response");
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        Alert.alert("Success", `Recipe ${status}`);
        router.back();
      } else {
        Alert.alert("Error", "Failed to update status");
      }
    } catch (err) {
      console.error(err.message);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const recipeDetailFileStyles = recipeDetailStyles(recipe);

  return (
    <View style={recipeDetailFileStyles.container}>
      <ScrollView>
        <View style={recipeDetailFileStyles.headerContainer}>
          <View style={recipeDetailFileStyles.imageContainer}>
            <Image
              source={{ uri: recipe?.image }}
              style={recipeDetailFileStyles.headerImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
              style={recipeDetailFileStyles.gradientOverlay}
            />
          </View>
          <View style={recipeDetailFileStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailFileStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={recipeDetailFileStyles.titleSection}>
            <View style={recipeDetailFileStyles.categoryBadge}>
              <Text style={recipeDetailFileStyles.categoryText}>
                {recipe?.category}
              </Text>
            </View>
            <Text style={recipeDetailFileStyles.recipeTitle}>{recipe?.title}</Text>
            {recipe?.area && (
              <View style={recipeDetailFileStyles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.white}
                />
                <Text style={recipeDetailFileStyles.locationText}>
                  {recipe?.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={recipeDetailFileStyles.contentSection}>
          <View style={recipeDetailFileStyles.statsContainer}>
            <View style={recipeDetailFileStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailFileStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailFileStyles.statValue}>
                {recipe?.cookTime}
              </Text>
              <Text style={recipeDetailFileStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailFileStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailFileStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailFileStyles.statValue}>
                {recipe?.servings}
              </Text>
              <Text style={recipeDetailFileStyles.statLabel}>Servings</Text>
            </View>
          </View>
          <View style={recipeDetailFileStyles.sectionContainer}>
            <View style={recipeDetailFileStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailFileStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailFileStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailFileStyles.countBadge}>
                <Text style={recipeDetailFileStyles.countText}>
                  {recipe.ingredients.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={recipeDetailFileStyles.ingredientsGrid}>
            {recipe?.ingredients.map((ing, index) => (
              <View key={ing} style={recipeDetailFileStyles.ingredientCard}>
                <View style={recipeDetailFileStyles.ingredientNumber}>
                  <Text style={recipeDetailFileStyles.ingredientNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={recipeDetailFileStyles.ingredientText}>{ing}</Text>
                <View style={recipeDetailFileStyles.ingredientCheck}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={COLORS.textLight}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={recipeDetailFileStyles.instructionTitle}>
            <View style={recipeDetailFileStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailFileStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailFileStyles.sectionTitle}>Instructions</Text>
            </View>
            <View style={recipeDetailFileStyles.instructionsContainer}>
              {recipe?.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailFileStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailFileStyles.stepIndicator}
                  >
                    <Text style={recipeDetailFileStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>
                  <View style={recipeDetailFileStyles.instructionContent}>
                    <Text style={recipeDetailFileStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailFileStyles.instructionFooter}>
                      <Text style={recipeDetailFileStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={recipeDetailFileStyles.completeButton}
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
          <View style={recipeDetailFileStyles.adminApproveContainer}>
            <TouchableOpacity
              style={recipeDetailFileStyles.primaryButton}
              disabled={isSaving}
              onPress={() => updateStatus("approved")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "CC"]}
                style={recipeDetailFileStyles.buttonGradient}
              >
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                <Text style={recipeDetailFileStyles.buttonText}>Approve</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={recipeDetailFileStyles.primaryButton}
              disabled={isSaving}
              onPress={() => updateStatus("rejected")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "CC"]}
                style={recipeDetailFileStyles.buttonGradient}
              >
                <Ionicons name="close" size={20} color={COLORS.white} />
                <Text style={recipeDetailFileStyles.buttonText}>Reject</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
