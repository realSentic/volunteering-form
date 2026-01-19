// ====================================================================
// Importing URL from config.js (must be in the same folder)
// ====================================================================
import { N8N_TIME_IN_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timeForm");
  const message = document.getElementById("message");
  const submitLoader = document.getElementById("submitLoader");

  if (!form) {
    console.error("timeForm not found in HTML");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const type = document.getElementById("type")?.value;

    if (!name) {
      message.textContent = "❌ Please enter your name.";
      return;
    }

    // Show loader
    submitLoader?.classList.remove("hidden");
    message.textContent = "";

    try {
      const response = await fetch(N8N_TIME_IN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, type })
      });

      if (response.ok) {
        const result = await response.json();
        message.textContent = result.message || "✅ Time logged successfully!";
        form.reset();
      } else {
        console.error(`Webhook returned status: ${response.status}`);
        message.textContent = "❌ Error logging time. Please try again.";
      }

    } catch (error) {
      console.error("Network error:", error);
      message.textContent = "❌ Network error. Please try again later.";
    } finally {
      submitLoader?.classList.add("hidden");
    }
  });
});
