import { ENV } from "./api/config/env";

export default {
  schema: "./api/db/schema.js",
  out: "./api/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: ENV.DATABASE_URL }
};
