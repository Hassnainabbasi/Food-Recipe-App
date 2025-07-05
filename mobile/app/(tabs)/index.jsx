import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { homeStyles } from "../../assets/styles/homes.styles";
import CategoriesFilterCard from "../../components/CategoriesFilterCard";
import RecipeCard from "../../components/RecipeCard";
import { COLORS } from "../../constant/color";
import { MealApi } from "../../services/mealApi";

const HomeScreen = () => {
  const router = useRouter();
  const [selectCategory, setSelectCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featureRecipe, setFeatureRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
  return (
    <View style={homeStyles.container}>
      <ScrollView
        contentContainerStyle={homeStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{ width: 100, height: 100 }}
          />
          <Image
            source={require("../../assets/images/chicken.png")}
            style={{ width: 100, height: 100 }}
          />
          <Image
            source={require("../../assets/images/cow.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>
        {featureRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featureRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featureRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Feature</Text>
                  </View>
                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle}>
                      {featureRecipe.title}
                    </Text>
                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe.servings}
                        </Text>
                      </View>
                      {featureRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featureRecipe.area}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {categories.length > 0 && (
          <CategoriesFilterCard
            categories={categories}
            selectCategory={selectCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectCategory}</Text>
          </View>
        </View>
        {recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
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
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
