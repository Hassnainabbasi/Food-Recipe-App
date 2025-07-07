import cron from "cron";
import http from "http";
import https from "https";
import { URL } from "url";

const job = new cron.CronJob("*/14 * * * *", function () {
  let apiUrl =
    process.env.API_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/health`
      : "http://localhost:5001/api/health");

  if (!apiUrl) {
    console.error("❌ API_URL is not defined.");
    return;
  }

  let client;
  try {
    const { protocol } = new URL(apiUrl);
    client = protocol === "https:" ? https : http;
  } catch (error) {
    console.error("❌ Invalid API_URL:", error.message);
    return;
  }

  client
    .get(apiUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ API is working");
      } else {
        console.log("❌ API is not working", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.error("🚨 Error making request:", e.message);
    });
});

export default job;
