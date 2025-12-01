    const form = document.getElementById('timeForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;

      try {
        // Replace this URL with your Apps Script Web App or n8n webhook
        const response = await fetch('https://senticstrange.app.n8n.cloud/webhook/time-in', {
          method: 'POST', // or POST if using n8n webhook
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });

        const result = await response.text();
        message.textContent = "✅ Time logged successfully!";
        form.reset();
      } catch (error) {
        console.error(error);
        message.textContent = "❌ There was an error. Please try again.";
      }
    });
