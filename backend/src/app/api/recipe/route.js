import { recipesTable } from "../../db/schema";
import { db } from "../../config/drizzle";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

async function fakeTranslateToUrdu(text) {
  const res = await fetch("https://translation-api.com/translate");
  const data = await res.json();
  return data.translatedText;
}

// export async function POST(req) {
//   try {
//     const {
//       userId,
//       title,
//       image,
//       category,
//       servings,
//       cookTime,
//       ingredients,
//       instructions,
//       description,
//     } = await req.json();

//     if (
//       !userId ||
//       !title ||
//       !image ||
//       !servings ||
//       !cookTime ||
//       !ingredients ||
//       !category
//     ) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const parsedIngredients =
//       typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

//     if (!Array.isArray(parsedIngredients)) {
//       return NextResponse.json(
//         { error: "Ingredients must be an array" },
//         { status: 400, headers: corsHeaders }
//       );
//     }
//     console.log("Parsed ingredients:", parsedIngredients);
//     console.log("Payload going to DB:", {
//       userId,
//       title,
//       image,
//       category,
//       servings,
//       cookTime,
//       ingredients: parsedIngredients,
//       instructions,
//       description,
//     });

//     const inserted = await db
//       .insert(recipesTable)
//       .values({
//         userId,
//         title,
//         image,
//         category,
//         servings,
//         cookTime,
//         ingredients: parsedIngredients,
//         instructions,
//         description,
//       })
//       .returning();

//     return NextResponse.json(inserted[0], {
//       status: 201,
//       headers: corsHeaders,
//     });
//   } catch (error) {
//     console.error("DB Insert Error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong", detail: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     const {
//       userId,
//       title,
//       title_ur,
//       description,
//       description_ur,
//       image,
//       category,
//       category_ur,
//       servings,
//       cookTime,
//       ingredients,
//       instructions,
//       instructions_ur,
//     } = await req.json();

//     if (
//       !userId ||
//       !title ||
//       !image ||
//       !servings ||
//       !cookTime ||
//       !ingredients ||
//       !category
//     ) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const parsedIngredients =
//       typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

//     const parsedInstructions =
//       typeof instructions === "string"
//         ? instructions.split(/\r?\n/).filter((step) => step.trim())
//         : instructions;

//     const parsedInstructionsUr =
//       typeof instructions_ur === "string"
//         ? instructions_ur.split(/\r?\n/).filter((step) => step.trim())
//         : instructions_ur;

//     const inserted = await db
//       .insert(recipesTable)
//       .values({
//         userId,
//         title,
//         title_json: { en: title, ur: title_ur || title },
//         description,
//         description_json: {
//           en: description || "",
//           ur: description_ur || description || "",
//         },
//         image,
//         category,
//         category_json: { en: category, ur: category_ur || category },
//         servings,
//         cookTime,
//         ingredients: parsedIngredients.map((item) =>
//           typeof item === "string"
//             ? { en: item, ur: item }
//             : { en: item.en, ur: item.ur || item.en }
//         ),
//         instructions: parsedInstructions.join("\n"),
//         instructions_json: {
//           en: parsedInstructions,
//           ur: parsedInstructionsUr || parsedInstructions,
//         },
//       })
//       .returning();

//     return NextResponse.json(inserted[0], {
//       status: 201,
//       headers: corsHeaders,
//     });
//   } catch (error) {
//     console.error("DB Insert Error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong", detail: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    const {
      userId,
      title,
      description,
      image,
      category,
      servings,
      cookTime,
      ingredients,
      instructions,
    } = await req.json();

    if (
      !userId ||
      !title ||
      !description ||
      !image ||
      !category ||
      !servings ||
      !cookTime ||
      !ingredients ||
      !instructions
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    if (!Array.isArray(parsedIngredients)) {
      return NextResponse.json(
        { error: "Ingredients must be an array" },
        { status: 400, headers: corsHeaders }
      );
    }

    const multilingualIngredients = parsedIngredients.map((item) => {
      const text = typeof item === "string" ? item : item.en;
      return {
        en: text,
        ur: fakeTranslateToUrdu(text),
      };
    });

    const parsedInstructions =
      typeof instructions === "string"
        ? instructions.split(/\r?\n/).filter((step) => step.trim())
        : instructions;

    const instructionsWithTranslation = {
      en: parsedInstructions,
      ur: parsedInstructions.map((step) => fakeTranslateToUrdu(step)),
    };

    const inserted = await db
      .insert(recipesTable)
      .values({
        userId,
        title,
        title_json: { en: title, ur: fakeTranslateToUrdu(title) },
        description,
        description_json: {
          en: description,
          ur: fakeTranslateToUrdu(description),
        },
        image,
        category,
        category_json: { en: category, ur: fakeTranslateToUrdu(category) },
        servings,
        cookTime,
        ingredients: multilingualIngredients,
        instructions: parsedInstructions.join("\n"),
        instructions_json: instructionsWithTranslation,
      })
      .returning();

    console.log(inserted[0], "data saved");
    return NextResponse.json(inserted[0], {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
        detail: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const recipes = await db.select().from(recipesTable);
    if (!recipes || recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes available" },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(recipes, {
      status: 200,
      headers: corsHeaders,
      message: "Recipe route working",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
