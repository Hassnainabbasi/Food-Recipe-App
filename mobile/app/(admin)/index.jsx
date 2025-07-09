import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-reanimated";

import { authStyles } from "../../assets/styles/auth.styles";
import { homeStyles } from "../../assets/styles/homes.styles";
import AdminRecipeCard from "../../components/AdminRecipeCard";
import FadeInModalContent from "../../components/FadInModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constant/color";
import { MealApi } from "../../services/mealApi";

export default function index() {
  const [selectCategory, setSelectCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featureRecipe, setFeatureRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { isSignedIn, signOut } = useClerk();

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, randomMeals, feauturedMeal] = await Promise.all([
        MealApi.getCategories(),
        MealApi.getRandomMeals(12),
        MealApi.getRandomMeal(),
      ]);

      const transformCategpories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformCategpories);

      const transformMeals = randomMeals
        .map((meal) => MealApi.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformMeals);

      const transformedFeatured = MealApi.transformMealData(feauturedMeal);
      setFeatureRecipe(transformedFeatured);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategory = async (category) => {
    try {
      const meals = await MealApi.filterByCategory(category);
      const transform = meals
        .map((meal) => MealApi.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transform);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectCategory(category);
    await loadCategory(category);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <View style={authStyles.adminContainer}>
      <ScrollView>
        <View style={homeStyles.welcomeSection}>
          {menuVisible ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}
            >
              <FadeInModalContent onClose={() => setMenuVisible(false)} />
            </Modal>
          ) : (
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <Ionicons name="menu" size={32} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>
        <View>
          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <AdminRecipeCard recipe={item} />}
              keyExtractor={(item) => item?.id?.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={homeStyles.emptyState}>
                  <Ionicons
                    name="restaurant-outline"
                    size={64}
                    color={COLORS.textLight}
                  />
                  <Text style={homeStyles.emptyTitle}>No Recipes Found</Text>
                  <Text style={homeStyles.emptyDescription}>
                    Try a different category
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color={COLORS.textLight}
              />
              <Text style={homeStyles.emptyTitle}>No Recipes Found</Text>
              <Text style={homeStyles.emptyDescription}>
                Try a different category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
