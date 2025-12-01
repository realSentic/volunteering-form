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

    // Handle form submission + loading screen + redirect
document.addEventListener("DOMContentLoaded", () => {
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
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
      loadingOverlay.classList.add("hidden");
    }
  });
});
