import express from "express";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import { ENV } from "./config/env.js";
import job from "./config/cron.js";
import cors from "cors";
import serverless from "serverless-http";

const app = express();
const PORT = 5001;

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

job.start();

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const result = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    res.status(200).json(userFavorites);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, servings, cookTime } = req.body;

    if (!userId || !recipeId || !title || !image || !servings || !cookTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        servings,
        cookTime,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (e) {
    if (e.message.includes("duplicate key") || e.message.includes("unique")) {
      return res
        .status(409)
        .json({ error: "Recipe already favorited by this user" });
    }
    console.log(e.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("✅ API is live and working!");
});

export const handler = serverless(app);
