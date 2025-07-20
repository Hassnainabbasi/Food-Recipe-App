import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { searchStyles } from "../../assets/styles/search.styles";
import LoadingSpinner from "../../components/LoadingSpinner";
import RecipeCard from "../../components/RecipeCard";
import RecipeNotFound from "../../components/RecipeNotFound";
import { COLORS } from "../../constant/color";
import "../../constant/setup";
import useDebounce from "../../hooks/useDebounce";  
import { MealApi } from "../../services/mealApi";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    if (!query.trim()) {
      const randomMeals = await MealApi.getRandomMeals(12);
      return randomMeals
        .map((meal) => MealApi.transformMealData(meal))
        .filter((meal) => meal !== null);
    }

    const nameSearch = await MealApi.searchMealsByName(query);
    let result = nameSearch;

    if (result.length === 0) {
      const ingredientResults = await MealApi.filterByIngredent(query);
      result = ingredientResults;
    }

    return result
      .slice(0, 12)
      .map((meal) => MealApi.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  useEffect(() => {
    const loadInitailly = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitailly();
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const handleSearch = async () => {
      setLoading(true);

      try {
        const result = await performSearch(debouncedSearchQuery);
        setRecipes(result);
      } catch (error) {
        console.error(error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery, initialLoading]);

  if (initialLoading) return <LoadingSpinner />;

  console.log(searchQuery, "this is serach query");
  console.log(recipes, "yeh search ki ");

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search Recipes, Cooking Methods"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Result for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length}</Text>
        </View>
      </View>
      {loading ? (
        <View style={searchStyles.loadingContainer}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={recipes.filter((item) => !!item)}
          renderItem={({ item }) =>
            item ? <RecipeCard recipe={item} /> : null
          }
          numColumns={2}
          columnWrapperStyle={searchStyles.row}
          keyExtractor={(item) => item?.id?.toString()}
          style={searchStyles.recipesGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<RecipeNotFound />}
        />
      )}
    </View>
  );
}
