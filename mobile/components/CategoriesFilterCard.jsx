import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../assets/styles/homes.styles";

export default function CategoriesFilterCard({
  categories,
  selectCategory,
  onSelectCategory,
}) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selectCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                homeStyles.categoryButton,
                isSelected && homeStyles.selectedCategory,
              ]}
              onPress={() => onSelectCategory(cat.name)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: cat.image }}
                style={[
                  homeStyles.categoryImage,
                  isSelected && homeStyles.selectedCategory,
                ]}
                contentFit="cover"
                transition={300}
              />
              <Text
                style={[
                  homeStyles.categoryText,
                  isSelected && homeStyles.selectedCategoryText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
