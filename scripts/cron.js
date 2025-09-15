const cron = require("node-cron");
// const base_url="http://localhost:3000/"
const base_url="https://v2.leaphrms.com/"

cron.schedule("0 */5 * * * *", async () => {
    
    
    const res = await fetch(`${base_url}api/cron-apis/push-stop-attendance`, {
      method: "POST", // or "POST"
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    console.log("Stop Attendance Cron Job:", data);
});

cron.schedule("0 */5 * * * *", async () => {
    
    
    const res = await fetch(`${base_url}api/cron-apis/push-paused-attendance`, {
      method: "POST", // or "POST"
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    console.log("Stop Attendance Cron Job:", data);
});

console.log("🚀 Cron initialized...");