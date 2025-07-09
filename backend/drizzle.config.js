import { ENV } from "./src/config/env.js";

export default {
  schema: "./src/app/db/schema.js",
  out: "./src/app/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_N2vD9EtQqAGF@ep-wispy-cake-a9xc1960-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
};
