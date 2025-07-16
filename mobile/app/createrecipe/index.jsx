import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constant/color";
import { HOST_URL } from "../../constant/constant";
import { WEB_URL } from "../../services/mealApi";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [servings, setServings] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false);

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
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          await SecureStore.deleteItemAsync("token");
        }
      } else {
        setIsLoggedIn(false);
        await SecureStore.deleteItemAsync("token");
        router.push("/(auth)/sign-in");
      }
    };

    checkToken();
  }, []);
  const userId = user?.id;
  const updateIngredient = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };
  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const categoryOptions = [
    { label: "Chicken Recipes", value: "chicken" },
    { label: "Beef / Mutton Recipes", value: "beef" },
    { label: "Vegetarian Recipes", value: "vegetarian" },
    { label: "Rice Dishes", value: "rice" },
    { label: "Snacks & Street Food", value: "street_food" },
    { label: "Breakfast Recipes", value: "breakfast" },
    { label: "Fast Food", value: "fast food" },
    { label: "BBQ & Grilled", value: "bbq" },
    { label: "Desserts & Sweets", value: "desserts" },
    { label: "Baking", value: "baking" },
    { label: "Curries / Gravies", value: "curries" },
    { label: "Ramzan Specials", value: "ramzan" },
  ];

  const handleSignIn = async () => {
    let imageUrl = "";
    if (image) {
      const fileType = image.split(".").pop();
      const mimeType = `image/${fileType}`;
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        type: mimeType,
        name: `upload.${fileType}`,
      });
      formData.append("upload_preset", "Food Recipe");
      formData.append("cloud_name", "djmfadch8");
      console.log("formData", formData);
      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/djmfadch8/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          const error = await res.json();
          console.error("Error uploading image:", error.message);
          return;
        }

        const imageData = await res.json();
        console.log("imageData", imageData);
        imageUrl = imageData.secure_url;
        console.log(imageUrl, "imageUrl");
      } catch (error) {
        console.log(error.message);
      }
    }
    setLoading(true);
    const data = {
      title,
      image: imageUrl,
      servings,
      cookTime,
      ingredients: JSON.stringify(ingredients),
      instructions,
      description,
      category,
      userId,
    };
    try {
      const response = await fetch(`${WEB_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to Add Recipe");
      const result = await response.json();
      console.log(response, "response");
      console.log(result, "data");
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("image", result.assets[0].uri);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "web" ? "height" : "padding"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Text style={authStyles.createTitle}>Add Recipe</Text>

            <View style={authStyles.formContainer}>
              <View
                style={[authStyles.inputContainer, authStyles.pickerWrapper]}
              >
                <Dropdown
                  style={authStyles.dropdown}
                  containerStyle={authStyles.dropdownMenu}
                  data={categoryOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Category"
                  value={category}
                  onChange={(item) => setCategory(item.value)}
                  placeholderStyle={{ color: COLORS.textLight }}
                  selectedTextStyle={{ color: COLORS.text }}
                  iconColor={COLORS.text}
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Recipe Title"
                  placeholderTextColor={COLORS.textLight}
                  value={title}
                  onChangeText={setTitle}
                  autoCapitalize="none"
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Cook Time"
                  placeholderTextColor={COLORS.textLight}
                  value={cookTime}
                  onChangeText={setCookTime}
                  autoCapitalize="none"
                />
              </View>
              {ingredients.map((item, index) => (
                <View key={index} style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor={COLORS.textLight}
                    value={item}
                    onChangeText={(text) => updateIngredient(text, index)}
                    autoCapitalize="none"
                  />
                </View>
              ))}

              <TouchableOpacity onPress={addIngredientField}>
                <Text style={{ color: COLORS.primary, marginBottom: 10 }}>
                  + Add Ingredient
                </Text>
              </TouchableOpacity>

              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Servings"
                  placeholderTextColor={COLORS.textLight}
                  value={servings}
                  onChangeText={setServings}
                  autoCapitalize="none"
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Instruction"
                  placeholderTextColor={COLORS.textLight}
                  value={instructions}
                  onChangeText={setInstructions}
                  autoCapitalize="none"
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter Description"
                  placeholderTextColor={COLORS.textLight}
                  value={description}
                  onChangeText={setDescription}
                  autoCapitalize="none"
                />
              </View>
              <View style={authStyles.inputContainer}>
                <TouchableOpacity
                  style={[
                    authStyles.dropZone,
                    { borderColor: image ? COLORS.primary : COLORS.border },
                  ]}
                  onPress={handleImagePick}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={authStyles.previewImage}
                    />
                  ) : (
                    <Text
                      style={{ color: COLORS.textLight, textAlign: "center" }}
                    >
                      Drag & Drop or Tap to Upload Image
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  loading && authStyles.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Loading..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
