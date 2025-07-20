import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { homeStyles } from "../../assets/styles/homes.styles";
import ApproveRecipeCard from "../../components/ApproveRecipeCard";
import { COLORS } from "../../constant/color";
import { Admin_URL } from "../../services/mealApi";

export default function Checkreq() {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const response = await fetch(`${Admin_URL}`);
        const data = await response.json();
        setRecipes(
          Array.isArray(data.meals)
            ? data.meals.map(meal => ({
                ...meal,
                id: meal.id || meal.idMeal || Math.random().toString(36).substr(2, 9)
              }))
            : []
        );
        console.log(data, "data recipes");
      } catch (error) {
        setRecipes(null);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  console.log(recipes, "yeh check walay ki");

  if (loading) return <LoadingSpinner />;

  return (
    <View>
      {recipes?.filter((item) => !!item).length > 0 ? (
        <FlatList
          data={recipes.filter((item) => !!item)}
          renderItem={({ item }) => {
            console.log("FlatList item:", item);
            return item ? <ApproveRecipeCard recipe={item} /> : null;
          }}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          numColumns={1}
          contentContainerStyle={homeStyles.adminrecipesGrid}
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
  );
}
