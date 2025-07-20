// const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// export const MealAPI = {
//   // search meal by name
//   searchMealsByName: async (query) => {
//     try {
//       const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
//       const data = await response.json();
//       return data.meals || [];
//     } catch (error) {
//       console.error("Error searching meals by name:", error);
//       return [];
//     }
//   },

//   // lookup full meal details by id
//   getMealById: async (id) => {
//     try {
//       const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
//       const data = await response.json();
//       return data.meals ? data.meals[0] : null;
//     } catch (error) {
//       console.error("Error getting meal by id:", error);
//       return null;
//     }
//   },

//   // lookup a single random meal
//   getRandomMeal: async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/random.php`);
//       const data = await response.json();
//       return data.meals ? data.meals[0] : null;
//     } catch (error) {
//       console.error("Error getting random meal:", error);
//       return null;
//     }
//   },

//   // get multiple random meals
//   getRandomMeals: async (count = 6) => {
//     try {
//       const promises = Array(count)
//         .fill()
//         .map(() => MealAPI.getRandomMeal());
//       const meals = await Promise.all(promises);
//       return meals.filter((meal) => meal !== null);
//     } catch (error) {
//       console.error("Error getting random meals:", error);
//       return [];
//     }
//   },

//   // list all meal categories
//   getCategories: async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/categories.php`);
//       const data = await response.json();
//       return data.categories || [];
//     } catch (error) {
//       console.error("Error getting categories:", error);
//       return [];
//     }
//   },

//   // filter by main ingredient
//   filterByIngredient: async (ingredient) => {
//     try {
//       const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
//       const data = await response.json();
//       return data.meals || [];
//     } catch (error) {
//       console.error("Error filtering by ingredient:", error);
//       return [];
//     }
//   },

//   // filter by category
//   filterByCategory: async (category) => {
//     try {
//       const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
//       const data = await response.json();
//       return data.meals || [];
//     } catch (error) {
//       console.error("Error filtering by category:", error);
//       return [];
//     }
//   },

//   // transform TheMealDB meal data to our app format
//   transformMealData: (meal) => {
//     if (!meal) return null;

//     // extract ingredients from the meal object
//     const ingredients = [];
//     for (let i = 1; i <= 20; i++) {
//       const ingredient = meal[`strIngredient${i}`];
//       const measure = meal[`strMeasure${i}`];
//       if (ingredient && ingredient.trim()) {
//         const measureText = measure && measure.trim() ? `${measure.trim()} ` : "";
//         ingredients.push(`${measureText}${ingredient.trim()}`);
//       }
//     }

//     // extract instructions
//     const instructions = meal.strInstructions
//       ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
//       : [];

//     return {
//       id: meal.idMeal,
//       title: meal.strMeal,
//       description: meal.strInstructions
//         ? meal.strInstructions.substring(0, 120) + "..."
//         : "Delicious meal from TheMealDB",
//       image: meal.strMealThumb,
//       cookTime: "30 minutes",
//       servings: 4,
//       category: meal.strCategory || "Main Course",
//       area: meal.strArea,
//       ingredients,
//       instructions,
//       originalData: meal,
//     };
//   },
// };
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
      console.log(data, "idmeal");
      
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
      // console.log(data, "getMealByAdminId");
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
      // console.log(data, "randommeal");
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
      // console.log(data, "adminrandom");
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
      // console.log(meals,'allmealsrandom');
      return meals.filter((meal) => meal !== null);
    } catch (e) {
      console.log("getRandomMeals error:", e);
      return [];
    }
  },

  getAdminMeals: async () => {
    try {
      const res = await fetch(`${Admin_URL}`);
      const data = await res.json();
      // console.log(data, "adminkimealsall");
      return data.meals || [];
    } catch (e) {
      console.log("getAdminMeals error:", e);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${WEB_URL}/categories.php`);
      const data = await res.json();
      // console.log(data, "categoriesall");
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
      // console.log(data, "filterbycategoires");
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
      // console.log(data, "filterkrkyagypichyki"); 
      return data.meals || [];
    } catch (e) {
      console.log("filterByCategory error:", e);
      return [];
    }
  },
  transformMealData: (meal) => {
    if (!meal) return null;
    let ingredients = [];
    if (Array.isArray(meal.ingredients)) {
      ingredients = meal.ingredients.map((ing) => ing.en || ing || "");
    } else {
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
