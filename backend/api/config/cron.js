// import cron from "cron";
// import https from "https";

// const job = new cron.CronJob("*/14 * * * *", function () {
//   https
//     .get(process.env.API_URL, (res) => {
//       if (res.statusCode === 200) console.log("API is working");
//       else console.log("API is not working", res.statusCode);
//     })
//     .on("error", (e) => console.log(" Got error: ", e));
// });

// export default job;

import cron from "cron";
import http from "http";
import https from "https";
import { URL } from "url";

const job = new cron.CronJob("*/14 * * * *", function () {
  const apiUrl = process.env.API_URL;

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
