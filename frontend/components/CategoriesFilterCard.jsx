import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../assets/styles/homes.styles";

function capitalize(name) {
  if (!name) return "";
  const word = name.split(" ");
  word[0] = word[0].charAt(0).toUpperCase() + word[0].slice(1);
  return word.join(" ");
}

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
                {capitalize(cat.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
