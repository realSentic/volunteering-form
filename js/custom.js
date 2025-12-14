// =================================================================
// 0. Import Configuration
// =================================================================
// Assuming this file is located in the same directory as config.js
import { 
    N8N_FETCH_JOBS_URL, 
    N8N_SUBMIT_FORM_URL 
} from '/js/config.js'; // Note the .js extension is often required for vanilla ES Modules

// =================================================================
// 1. Tailwind Configuration
// (No changes here, keeping for completeness)
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
// 2. Dynamic Job Loading and Form Submission Logic
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // NO MORE HARDCODED URLS HERE! They are now imported constants.
    
    const DROPDOWN_ID = 'area';
    const POLLING_INTERVAL = 60000; // Check for updates every 60 seconds

    const form = document.getElementById("volunteerForm");
    const loadingOverlay = document.getElementById("loadingOverlay");

    // --- A. Job Fetching and Dropdown Population (Polling Function) ---
    async function fetchAndPopulateJobs() {
        const dropdown = document.getElementById(DROPDOWN_ID);
        
        if (!dropdown) return;

        // Set loading state
        dropdown.innerHTML = '<option value="" disabled selected>Fetching latest jobs...</option>';

        try {
            // Fetch using the imported N8N_FETCH_JOBS_URL
            const response = await fetch(N8N_FETCH_JOBS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            let data = await response.json();
            let jobsData = data;
            
            // Unwrap data if necessary
            if (Array.isArray(jobsData) && jobsData.length > 0 && jobsData[0].json) {
                jobsData = jobsData.map(item => item.json);
            }
            
            let optionsHTML = '<option value="" disabled selected>-- Select an area of focus --</option>';
            let activeJobsCount = 0;

            jobsData.forEach(job => {
                const jobName = job.Area; 
                const rowId = job.row_number; 
                const slots = Number(job['Max Slots']) || 0;
                const current = Number(job['Current Volunteers']) || 0;
                
                // Only show the job if there is space available
                if (jobName && (slots > current)) {
                    const remainingSlots = slots - current;
                    const displayLabel = `${jobName} (Slots: ${remainingSlots} available)`;
                    
                    // Value is the row ID for n8n to update the count
                    optionsHTML += `<option value="${rowId}">${displayLabel}</option>`;
                    activeJobsCount++;
                }
            });
            
            if (activeJobsCount === 0) {
                 optionsHTML = '<option value="" disabled selected>-- No jobs currently available --</option>';
            }

            dropdown.innerHTML = optionsHTML;

        } catch (error) {
            console.error('Error fetching jobs:', error);
            // Provide a clear error to the user
            dropdown.innerHTML = '<option value="" disabled selected>-- Error loading jobs (Check Tunnel) --</option>';
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
            // Send the row ID to n8n for logging/lookup
            job_row_id: areaDropdown.value, 
            reason: document.getElementById('reason').value,
            // Send the displayed text
            job_name: areaDropdown.options[areaDropdown.selectedIndex].text.split('(')[0].trim()
        };
        
        // Validation check for job selection
        if (!data.job_row_id) {
            loadingOverlay.classList.add('hidden');
            alert('Please select a volunteer area.');
            return;
        }

        try {
            // Submit using the imported N8N_SUBMIT_FORM_URL
            const response = await fetch(N8N_SUBMIT_FORM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            loadingOverlay.classList.add('hidden'); // Hide loading screen

            if (!response.ok) {
                // Throw an error if the HTTP status is not successful
                throw new Error(`Server error or n8n failure. Status: ${response.status}`);
            }

            alert('🎉 Registration submitted successfully! We will be in touch shortly.');
            form.reset();
            
            // Crucial: Re-fetch jobs immediately to update the slot count after a successful sign-up
            fetchAndPopulateJobs(); 

        } catch (err) {
            loadingOverlay.classList.add('hidden'); // Hide loading screen
            console.error("Submission Error:", err);
            // Inform the user clearly what might be wrong
            alert(`❌ Error submitting form. Check that the Cloudflare Tunnel is running. Details: ${err.message}`);
        }
    });
});
