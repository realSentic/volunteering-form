// ====================================================================
// ⚠️ IMPORTANT: UPDATE THIS BASE URL
// Use the current HTTPS URL from your Cloudflare Tunnel terminal (without a trailing slash)
// ====================================================================
const CLOUDFLARE_TUNNEL_BASE = 'https://raleigh-packard-perry-sonic.trycloudflare.com/';

// --- n8n Webhook Endpoint (Updated to use the HTTPS tunnel) ---
const N8N_TIME_IN_URL = `${CLOUDFLARE_TUNNEL_BASE}/webhook/time-in`;


const form = document.getElementById('timeForm');
const message = document.getElementById('message');
const submitLoader = document.getElementById('submitLoader');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const type = document.getElementById('type').value;

  if (!name) {
    message.textContent = "❌ Please enter your name.";
    return;
  }

  // Show the submitting loader
  submitLoader.classList.remove('hidden');
  message.textContent = "";

  try {
    // Use the updated secure tunnel URL
    const response = await fetch(N8N_TIME_IN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    });

    if (response.ok) {
      const result = await response.json();
      message.textContent = result.message || "✅ Time logged successfully!";
      form.reset();
    } else {
      // Log the specific status for debugging
      console.error(`Webhook returned non-OK status: ${response.status}`);
      message.textContent = "❌ Error logging time. Please try again. (Check n8n status)";
    }
  } catch (error) {
    console.error("Network error during time logging:", error);
    message.textContent = "❌ Network error. Please ensure the Cloudflare Tunnel is running.";
  } finally {
    // Hide the loader in all cases
    submitLoader.classList.add('hidden');
  }
});
