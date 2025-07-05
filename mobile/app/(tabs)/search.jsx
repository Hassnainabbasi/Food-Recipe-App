import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MealApi } from "../../services/mealApi";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
      }
    };
    loadInitailly()
  }, []);

  return (
    <View>
      <Text>SearchScreen</Text>
    </View>
  );
}
