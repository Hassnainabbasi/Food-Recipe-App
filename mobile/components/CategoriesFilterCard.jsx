import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../assets/styles/homes.styles";

// export const getLocalized = (obj, key, lang = "en") => {
//   if (!obj || !obj[`${key}_json`]) return obj[key] || "";
//   return obj[`${key}_json`][lang] || obj[key];
// };

export default function CategoriesFilterCard({
  categories,
  selectCategory,
  onSelectCategory,
  lang,
}) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {categories.map((cat) => {
          const localizedName = cat.category_json[lang] || cat.name;
          const isSelected = selectCategory === localizedName;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                homeStyles.categoryButton,
                isSelected && homeStyles.selectedCategory,
              ]}
              onPress={() => onSelectCategory(localizedName)}
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
                {localizedName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
