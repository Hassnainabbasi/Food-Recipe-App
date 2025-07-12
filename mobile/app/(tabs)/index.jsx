import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { homeStyles } from "../../assets/styles/homes.styles";
import CategoriesFilterCard from "../../components/CategoriesFilterCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import RecipeCard from "../../components/RecipeCard";
import { COLORS } from "../../constant/color";
import { ADMIN_EMAIL } from "../../constant/constant";
import { MealApi } from "../../services/mealApi";

const getLocalized = (obj, key, lang) => {
  if (!obj) return "";

  const localizedObj = obj[`${key}_json`];

  if (localizedObj && typeof localizedObj === "object") {
    return localizedObj[lang] ?? obj[key];
  }

  return lang === "ur" ? obj[`${key}_ur`] ?? obj[key] : obj[key];
};

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const router = useRouter();
  const [selectCategory, setSelectCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featureRecipe, setFeatureRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { isSignedIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, randomMeals, feauturedMeal] = await Promise.all([
        MealApi.getCategories(),
        MealApi.getRandomMeals(12),
        MealApi.getRandomMeal(),
      ]);


      const transformCategpories = apiCategories.map((cat, index) => {
        return {
          id: index + 1,
          name: cat.category,
          image: cat.image,
          category_json: cat.category_json,
        };
      });

      setCategories(transformCategpories);
      console.log(transformCategpories, "transform Category");

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
      console.log(transform, "transform");
    } catch (error) {
      console.error(error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectCategory(category);
    await loadCategory(category);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      router.replace("/(admin)/");
    }
  }, [isLoaded, user]);

  if (loading) return <LoadingSpinner />;

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
          {menuVisible ? (
            <Modal
              animationType="fade"
              transparent={true}
              visible={menuVisible}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={homeStyles.modalOverlay}
              >
                <TouchableOpacity
                  style={homeStyles.closeButtonContainer}
                  onPress={() => setMenuVisible(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={homeStyles.modalContent}>
                  <TouchableOpacity
                    style={homeStyles.modalButton}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push("/createrecipe");
                    }}
                  >
                    <Text style={homeStyles.modalButtonText}>
                      {t("Add Recipe")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={homeStyles.modalButton}
                    onPress={() => {
                      setMenuVisible(false);
                      if (isSignedIn) {
                        signOut();
                      } else {
                        router.push("/(auth)/sign-in");
                      }
                    }}
                  >
                    <Text style={homeStyles.modalButtonText}>
                      {isSignedIn ? t("logout") : t("login")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <Ionicons name="menu" size={32} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              i18n.changeLanguage(i18n.language === "en" ? "ur" : "en")
            }
            style={{ marginLeft: 10 }}
          >
            <Text style={{ color: COLORS.text }}>
              {i18n.language === "en" ? "اردو" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        {featureRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featureRecipe?.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featureRecipe?.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>
                      {t("feature")}
                    </Text>
                  </View>
                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle}>
                      {getLocalized(featureRecipe, "title", lang)}
                    </Text>
                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe?.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featureRecipe?.servings}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {categories.length > 0 && (
          <CategoriesFilterCard
            getLocalized={getLocalized}
            lang={lang}
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
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                getLocalized={getLocalized}
                lang={lang}
              />
            )}
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
            <Text style={homeStyles.emptyTitle}>{t("noRecipes")}</Text>
            <Text style={homeStyles.emptyDescription}>
              {t("tryDifferentCategory")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
