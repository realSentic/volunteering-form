// ====================================================================
// ✅ UPDATED: Importing URLs from a central configuration file
// ====================================================================
import { 
    N8N_TIME_IN_URL // Assuming this constant is exported from config.js
} from './config.js'; // Use './config.js' if this script is in the same folder as config.js

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
        // Use the imported constant N8N_TIME_IN_URL
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
            // ✅ FIXED: Added opening parenthesis
            console.error(`Webhook returned non-OK status: ${response.status}`);
            message.textContent = "❌ Error logging time. Please try again. (Check n8n status)";
        }
    } catch (error) {
        console.error("Network error during time logging:", error);
        message.textContent = "❌ Network error. Please ensure the backend service is running.";
    } finally {
        // Hide the loader in all cases
        submitLoader.classList.add('hidden');
    }
});
