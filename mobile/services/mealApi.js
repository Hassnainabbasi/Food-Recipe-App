const BASE_URL = "http://192.168.0.106:3000/api/recipe";

export const MealApi = {
  // searchMealsByName: async (query) => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
  //     );
  //     const data = await response.json();
  //     return data.meals || [];
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // },
  // getMealById: async (id) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  //     const data = await response.json();
  //     return data.meals ? data.meals[0] : null;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // },
  // getRandomMeal: async () => {
  //   try {
  //     const res = await fetch(`${BASE_URL}/random.php`);
  //     const data = await res.json();
  //     return data.meals ? data.meals[0] : null;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // },
  // getRandomMeals: async (count = 6) => {
  //   try {
  //     const promises = Array(count)
  //       .fill()
  //       .map(() => MealApi.getRandomMeal());
  //     const meals = await Promise.all(promises);
  //     return meals.filter((meal) => meal !== null);
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // },
  // getCategories: async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/categories.php`);
  //     const data = await response.json();
  //     return data.categories || [];
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // },
  // filterByIngredent: async (ingredient) => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  //     );
  //     const data = await response.json();
  //     return data.meals || [];
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // },
  // filterByCategory: async (category) => {
  //   try {
  //     const response = await fetch(
  //       `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
  //     );
  //     const data = await response.json();
  //     return data.meals || [];
  //   } catch (e) {
  //     console.log(e);
  //     return [];
  //   }
  // },
  searchMealsByName: async (query) => {
    try {
      const res = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      return data.meals || [];
    } catch (e) {
      console.log("searchMealsByName error:", e);
      return [];
    }
  },

  getMealById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await res.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.log("getMealById error:", e);
      return null;
    }
  },

  getRandomMeal: async () => {
    try {
      const res = await fetch(`${BASE_URL}/random.php`);
      const data = await res.json();
      return data.meals ? data.meals[0] : null;
    } catch (e) {
      console.log("getRandomMeal error:", e);
      return null;
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
      console.log("getRandomMeals error:", e);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories.php`);
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
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
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
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
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
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const measureText =
          measure && measure.trim() ? `${measure.trim()}` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }
    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
