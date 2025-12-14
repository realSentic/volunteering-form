document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // prevent page refresh

    const data = {
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      phone: document.querySelector('#phone').value,
      area: document.querySelector('#area').value,
      reason: document.querySelector('#reason').value
    };

    fetch('http://localhost:5678/webhook/volunteer-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => alert('Form submitted successfully!'))
    .catch(err => alert('Error submitting form'));
  });
});

