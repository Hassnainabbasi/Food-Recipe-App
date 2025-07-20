// import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { MealAPI } from "../../services/mealAPI";
// import { homeStyles } from "../../assets/styles/home.styles";
// import { Image } from "expo-image";
// import { COLORS } from "../../constants/colors";
// import { Ionicons } from "@expo/vector-icons";
// import CategoryFilter from "../../components/CategoryFilter";
// import RecipeCard from "../../components/RecipeCard";
// import LoadingSpinner from "../../components/LoadingSpinner";

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const HomeScreen = () => {
//   const router = useRouter();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [recipes, setRecipes] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [featuredRecipe, setFeaturedRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadData = async () => {
//     try {
//       setLoading(true);

//       const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
//         MealAPI.getCategories(),
//         MealAPI.getRandomMeals(12),
//         MealAPI.getRandomMeal(),
//       ]);

//       const transformedCategories = apiCategories.map((cat, index) => ({
//         id: index + 1,
//         name: cat.strCategory,
//         image: cat.strCategoryThumb,
//         description: cat.strCategoryDescription,
//       }));

//       setCategories(transformedCategories);

//       if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

//       const transformedMeals = randomMeals
//         .map((meal) => MealAPI.transformMealData(meal))
//         .filter((meal) => meal !== null);

//       setRecipes(transformedMeals);

//       const transformedFeatured = MealAPI.transformMealData(featuredMeal);
//       setFeaturedRecipe(transformedFeatured);
//     } catch (error) {
//       console.log("Error loading the data", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCategoryData = async (category) => {
//     try {
//       const meals = await MealAPI.filterByCategory(category);
//       const transformedMeals = meals
//         .map((meal) => MealAPI.transformMealData(meal))
//         .filter((meal) => meal !== null);
//       setRecipes(transformedMeals);
//     } catch (error) {
//       console.error("Error loading category data:", error);
//       setRecipes([]);
//     }
//   };

//   const handleCategorySelect = async (category) => {
//     setSelectedCategory(category);
//     await loadCategoryData(category);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // await sleep(2000);
//     await loadData();
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   if (loading && !refreshing) return <LoadingSpinner message="Loading delicions recipes..." />;

//   return (
//     <View style={homeStyles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={COLORS.primary}
//           />
//         }
//         contentContainerStyle={homeStyles.scrollContent}
//       >
//         {/*  ANIMAL ICONS */}
//         <View style={homeStyles.welcomeSection}>
//           <Image
//             source={require("../../assets/images/lamb.png")}
//             style={{
//               width: 100,
//               height: 100,
//             }}
//           />
//           <Image
//             source={require("../../assets/images/chicken.png")}
//             style={{
//               width: 100,
//               height: 100,
//             }}
//           />
//           <Image
//             source={require("../../assets/images/pork.png")}
//             style={{
//               width: 100,
//               height: 100,
//             }}
//           />
//         </View>

//         {/* FEATURED SECTION */}
//         {featuredRecipe && (
//           <View style={homeStyles.featuredSection}>
//             <TouchableOpacity
//               style={homeStyles.featuredCard}
//               activeOpacity={0.9}
//               onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
//             >
//               <View style={homeStyles.featuredImageContainer}>
//                 <Image
//                   source={{ uri: featuredRecipe.image }}
//                   style={homeStyles.featuredImage}
//                   contentFit="cover"
//                   transition={500}
//                 />
//                 <View style={homeStyles.featuredOverlay}>
//                   <View style={homeStyles.featuredBadge}>
//                     <Text style={homeStyles.featuredBadgeText}>Featured</Text>
//                   </View>

//                   <View style={homeStyles.featuredContent}>
//                     <Text style={homeStyles.featuredTitle} numberOfLines={2}>
//                       {featuredRecipe.title}
//                     </Text>

//                     <View style={homeStyles.featuredMeta}>
//                       <View style={homeStyles.metaItem}>
//                         <Ionicons name="time-outline" size={16} color={COLORS.white} />
//                         <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
//                       </View>
//                       <View style={homeStyles.metaItem}>
//                         <Ionicons name="people-outline" size={16} color={COLORS.white} />
//                         <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
//                       </View>
//                       {featuredRecipe.area && (
//                         <View style={homeStyles.metaItem}>
//                           <Ionicons name="location-outline" size={16} color={COLORS.white} />
//                           <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}

//         {categories.length > 0 && (
//           <CategoryFilter
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onSelectCategory={handleCategorySelect}
//           />
//         )}

//         <View style={homeStyles.recipesSection}>
//           <View style={homeStyles.sectionHeader}>
//             <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
//           </View>

//           {recipes.length > 0 ? (
//             <FlatList
//               data={recipes}
//               renderItem={({ item }) => <RecipeCard recipe={item} />}
//               keyExtractor={(item) => item.id.toString()}
//               numColumns={2}
//               columnWrapperStyle={homeStyles.row}
//               contentContainerStyle={homeStyles.recipesGrid}
//               scrollEnabled={false}
//               // ListEmptyComponent={}
//             />
//           ) : (
//             <View style={homeStyles.emptyState}>
//               <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
//               <Text style={homeStyles.emptyTitle}>No recipes found</Text>
//               <Text style={homeStyles.emptyDescription}>Try a different category</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };
// export default HomeScreen;
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { homeStyles } from "../../assets/styles/homes.styles.js";
import CategoriesFilterCard from "../../components/CategoriesFilterCard.jsx";
import LoadingSpinner from "../../components/LoadingSpinner";
import RecipeCard from "../../components/RecipeCards.jsx";
import { COLORS } from "../../constants/colors.js";
import { ADMIN_EMAIL, HOST_URL } from "../../constants/constant.js";
import { MealApi } from "../../services/mealAPI";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const checkAdminRedirect = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const res = await fetch(`${HOST_URL}/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            if (userData.user.email == ADMIN_EMAIL) {
              router.push("/(admin)/");
            }
          } else {
            console.log("Not logged in or unauthorized");
          }
        }
      } catch (error) {
        console.error("Error checking admin user:", error);
      }
    };

    checkAdminRedirect();
  }, []);

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
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          await SecureStore.deleteItemAsync("token");
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("token");
            const res = await fetch(`${HOST_URL}/api/user/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              setIsLoggedIn(false);
              await SecureStore.deleteItemAsync("token");
              const data = await res.json();
            }
            console.log("✅ Sign out successful");
          } catch (error) {
            console.error("❌ Error during sign out:", error.message);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner />;

  // console.log(recipes,'yeh main tab ki')

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
                      if (isLoggedIn) {
                        handleLogout();
                      } else {
                        router.push("/(auth)/sign-in");
                      }
                    }}
                  >
                    <Text style={homeStyles.modalButtonText}>
                      {isLoggedIn ? t("logout") : t("login")}
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
                          {featureRecipe?.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        {featureRecipe?.servings ? (
                          <Text style={homeStyles.metaText}>{featureRecipe.servings}</Text>
                        ) : (
                          <Text style={homeStyles.metaText}>-</Text>
                        )}
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
            categories={categories}
            selectCategory={selectCategory}
            onSelectCategory={handleCategorySelect}
            getLocalized={getLocalized}
            lang={lang}
          />
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectCategory}</Text>
          </View>
        </View>
        {recipes?.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
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
