import "dotenv/config";
import cron from "node-cron";
import fetch from "node-fetch";

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;
const CRON_INTERVAL = process.env.CRON_INTERVAL || "*/5 * * * *";

if (!FRONTEND_URL || !BACKEND_URL) {
  console.error("Missing FRONTEND_URL or BACKEND_URL in env");
  process.exit(1);
}

cron.schedule(CRON_INTERVAL, async () => {
  console.log(`\n[${new Date().toISOString()}] Cron started`);

  // 1️⃣ Hit frontend (ignore response body)
  try {
    const res = await fetch(FRONTEND_URL, { method: "GET" });
    console.log(`✔ Frontend hit → ${res.status}`);
  } catch (err) {
    console.error("✖ Frontend hit failed:", err.message);
  }

  // 2️⃣ Hit backend (expect JSON)
  try {
    const res = await fetch(BACKEND_URL, {
      headers: { "Accept": "application/json" }
    });

    const json = await res.json();
    console.log(`✔ Backend hit → ${json.success}`, json);
  } catch (err) {
    console.error("✖ Backend hit failed:", err.message);
  }
});

console.log("Cron worker running:", CRON_INTERVAL);
