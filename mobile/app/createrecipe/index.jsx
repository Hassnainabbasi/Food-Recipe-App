import { useClerk, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
import { ApiUrl } from "../../constant/api";
import { COLORS } from "../../constant/color";

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

  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user.id;
  const { isSignedIn } = useClerk();

  const updateIngredient = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };
  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  useEffect(() => {
    if (!isSignedIn || !user) {
      router.push("/(auth)/sign-in");
    }
  }, [isSignedIn, user]);

  const categoryOptions = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Dessert", value: "dessert" },
  ];

  const handleSignIn = async () => {
    let imageUrl = [];
    if (image) {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      formData.append("upload_preset", "Food Recipe");
      formData.append("cloud_name", "djmfadch8");

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
          console.error("Error uploading image:", error);
          return;
        }

        const imageData = await res.json();
        imageUrl = imageData.secure_url;
        console.log(imageUrl);
      } catch (error) {
        console.log(error);
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
      const response = await fetch(`${ApiUrl}/recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to Add Recipe");
      const result = await res.json();
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
