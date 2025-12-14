// ====================================================================
// ✅ UPDATED: Importing URLs from a central configuration file
// ====================================================================
import { 
    N8N_SUBMIT_FORM_URL // Assuming this constant is exported from config.js
} from '/js/config.js'; // Use './config.js' if this script is in the same folder as config.js


document.addEventListener('DOMContentLoaded', () => {
    // Removed CLOUDFLARE_TUNNEL_BASE and N8N_SUBMIT_FORM_URL constants here

    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]'); // Assuming you have a submit button

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // prevent page refresh

        // Simple loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        const data = {
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value,
            phone: document.querySelector('#phone').value,
            area: document.querySelector('#area').value,
            reason: document.querySelector('#reason').value
        };

        // Use the imported constant N8N_SUBMIT_FORM_URL
        fetch(N8N_SUBMIT_FORM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                // Check for specific n8n errors (like CORS or 400 status)
                throw new Error(`Server returned status: ${res.status}`);
            }
            return res.json();
        })
        .then(res => {
            alert('Form submitted successfully!');
            form.reset(); // Clear form on success
        })
        .catch(err => {
            console.error('Submission Error:', err);
            // More specific error message for the user
            alert('Error submitting form. Please ensure the n8n tunnel is running.');
        })
        .finally(() => {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit'; 
            }
        });
    });
});
