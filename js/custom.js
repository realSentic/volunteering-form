// =================================================================
// 1. Tailwind Configuration (KEEP THIS)
// =================================================================
tailwind.config = {
    theme: {
        extend: {
            keyframes: {
                'gradient-slow': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
            },
            animation: {
                'gradient-slow': 'gradient-slow 30s ease infinite',
            },
            backgroundSize: {
                'size-200': '200% 200%',
            },
        },
    },
};

// =================================================================
// 2. Dynamic Job Loading and Form Submission (NEW, CORRECT LOGIC)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // URL to get the list of available jobs from n8n (same as your React app uses)
    const N8N_FETCH_JOBS_URL = 'https://syiamfortunado.app.n8n.cloud/webhook/get-available-jobs';
    // URL to submit the volunteer form data to n8n (Use the URL from your OLD data.js)
    const N8N_SUBMIT_FORM_URL = 'https://syiamfortunado.app.n8n.cloud/webhook/volunteer-form';
    
    const DROPDOWN_ID = 'area';
    const POLLING_INTERVAL = 60000; // Check for updates every 60 seconds

    const form = document.getElementById("volunteerForm");
    const loadingOverlay = document.getElementById("loadingOverlay");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading overlay
    loadingOverlay.classList.remove("hidden");

    // Gather form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      area: document.getElementById("area").value,
      reason: document.getElementById("reason").value,
    };

    try {
      // send to n8n webhook
      await fetch("YOUR_N8N_WEBHOOK_URL", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      // Redirect after a small delay
      setTimeout(() => {
        window.location.href = "success.html";
      }, 1000);

        } catch (error) {
            console.error('Error fetching jobs:', error);
            dropdown.innerHTML = '<option value="" disabled selected>-- Error loading jobs --</option>';
        }
    }
    
    // Initial fetch and start polling
    fetchAndPopulateJobs();
    setInterval(fetchAndPopulateJobs, POLLING_INTERVAL);


    // --- B. Form Submission Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        loadingOverlay.classList.remove('hidden'); // Show loading screen

        const areaDropdown = document.getElementById(DROPDOWN_ID);

        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            // Key name changed to be clear for n8n:
            job_row_id: areaDropdown.value, 
            reason: document.getElementById('reason').value,
            // Get the displayed text (Job Name + Time)
            job_name: areaDropdown.options[areaDropdown.selectedIndex].text.split('(')[0].trim()
        };
        
        // Validation check for job selection
        if (!data.job_row_id) {
            loadingOverlay.classList.add('hidden');
            alert('Please select a volunteer area.');
            return;
        }

        try {
            const response = await fetch(N8N_SUBMIT_FORM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            loadingOverlay.classList.add('hidden'); // Hide loading screen

            if (!response.ok) {
                throw new Error('Server error or n8n failure. Status: ' + response.status);
            }

            alert('🎉 Registration submitted successfully! We will be in touch shortly.');
            form.reset();
            // Crucial: Re-fetch jobs immediately to update the slot count after a successful sign-up
            fetchAndPopulateJobs(); 

            // Optional: Redirect to a success page
            // window.location.href = "success.html"; 

        } catch (err) {
            loadingOverlay.classList.add('hidden'); // Hide loading screen
            console.error("Submission Error:", err);
            alert('❌ Error submitting form. Please try again later.');
        }
    });
});
