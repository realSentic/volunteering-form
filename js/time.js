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
    const response = await fetch('http://localhost:5678/webhook/time-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type })
    });

    if (response.ok) {
      const result = await response.json();
      message.textContent = result.message || "✅ Time logged successfully!";
      form.reset();
    } else {
      message.textContent = "❌ Error logging time. Please try again.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "❌ Network error. Please try again.";
  } finally {
    // Hide the loader in all cases
    submitLoader.classList.add('hidden');
  }
});
