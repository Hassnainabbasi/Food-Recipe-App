export const BASE_URL = "https://food-recipe-app-lnjg.vercel.app/api/recipe";
export const WEB_URL = "https://food-recipe-app-lnjg.vercel.app/api/recipe";
export const Fav_URL = "https://food-recipe-app-lnjg.vercel.app/api";
export const Admin_URL = "https://food-recipe-app-lnjg.vercel.app/api/admin";
export const Admin_Single_Url =
  "https://food-recipe-app-lnjg.vercel.app/api/admin";

export const MealApi = {
  searchMealsByName: async (query) => {
    try {
      const res = await fetch(
        `${WEB_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      console.log(data, "search");
      return data.meals || [];
    } catch (e) {
      console.log("searchMealsByName error:", e);
      return [];
    }
  },

  getMealById: async (id) => {
    try {
      const res = await fetch(`${WEB_URL}/lookup.php?i=${id}`);
      const data = await res.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.log("getMealById error:", e);
      return null;
    }
  },

  getMealByAdminId: async (id) => {
    try {
      const res = await fetch(`${Admin_Single_Url}/lookup.php?i=${id}`);
      const data = await res.json();
      console.log(data, "getMealByAdminId");
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.log("getMealById error:", e);
      return null;
    }
  },

  getRandomMeal: async () => {
    try {
      const res = await fetch(`${WEB_URL}/random.php`);
      const data = await res.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.log("getRandomMeal error:", e);
      return null;
    }
  },

  getAdminMeals: async () => {
    try {
      const res = await fetch(`${Admin_URL}`);
      const data = await res.json();
      return data.meals || [];
    } catch (e) {
      console.log("getRandomMeal error:", e);
      return [];
    }
  },

  getRandomMeals: async (count = 6) => {
    try {
      const promises = Array(count)
        .fill()
        .map(() => MealApi.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null);
    } catch (e) {
      getAdminMeals: async () => {
        try {
          const res = await fetch(`${Admin_URL}`);
          const data = await res.json();
          return data.meals || [];
        } catch (e) {
          console.log("getAdminMeals error:", e);
          return [];
        }
      },
        console.log("getRandomMeals error:", e);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${WEB_URL}/categories.php`);
      const data = await res.json();
      return data.categories || [];
    } catch (e) {
      console.log("getCategories error:", e);
      return [];
    }
  },

  filterByIngredient: async (ingredient) => {
    try {
      const res = await fetch(
        `${WEB_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await res.json();
      return data.meals || [];
    } catch (e) {
      console.log("filterByIngredient error:", e);
      return [];
    }
  },

  filterByCategory: async (category) => {
    try {
      const res = await fetch(
        `${WEB_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      return data.meals || [];
    } catch (e) {
      console.log("filterByCategory error:", e);
      return [];
    }
  },
  transformMealData: (meal) => {
    if (!meal) return null;
    // Try to extract ingredients from both custom and API fields
    let ingredients = [];
    if (Array.isArray(meal.ingredients)) {
      ingredients = meal.ingredients.map((ing) => ing.en || ing || "");
    } else {
      // For TheMealDB API style: strIngredient1, strIngredient2, ...
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim() !== "") ingredients.push(ing);
      }
    }

    return {
      id: meal.id || meal.idMeal,
      title: meal.title || meal.strMeal,
      description: meal.description
        ? meal.description.substring(0, 120) + "..."
        : meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from Recipe",
      image: meal.image || meal.strMealThumb,
      cookTime: meal.cookTime || meal.strCookTime || "",
      servings: meal.servings || meal.strServings || "",
      category: meal.category || meal.strCategory || "",
      area: meal.area?.[0]?.en || meal.strArea || "",
      originalData: meal,
      instructions: meal.instructions
        ? meal.instructions.split(/\r?\n/).filter((line) => line.trim() !== "")
        : meal.strInstructions
        ? meal.strInstructions
            .split(/\r?\n/)
            .filter((line) => line.trim() !== "")
        : [],
      ingredients,
    };
  },
};
