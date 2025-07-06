import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { config } from "dotenv";

const { Client } = pkg;

config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

const db = drizzle(client);

(async () => {
  await client.connect();

  await db.execute(sql`
    DELETE FROM favorites
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM favorites
      GROUP BY user_id, recipe_id
    );
  `);

  await db.execute(sql`
    ALTER TABLE favorites
    ADD CONSTRAINT favorites_user_id_recipe_id_unique UNIQUE (user_id, recipe_id);
  `);

  console.log("✅ Cleaned and added UNIQUE constraint.");
  await client.end();
})();
