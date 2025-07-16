import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { homeStyles } from "../../assets/styles/homes.styles";
import ApproveRecipeCard from "../../components/ApproveRecipeCard";
import { COLORS } from "../../constant/color";
import { Admin_URL } from "../../services/mealApi";

export default function Checkreq() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(`${Admin_URL}`);
      const data = await response.json();
      setRecipes(data);
      console.log(data, "data");
    };
    loadData();
  }, []);

  const handleApprove = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancel = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View>
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={({ item }) => <ApproveRecipeCard recipe={item} />}
          keyExtractor={(item) => item?.id?.toString()}
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
