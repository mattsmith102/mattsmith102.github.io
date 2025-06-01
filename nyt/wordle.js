// wordle.js

// 1. Grab ?date=YYYY-MM-DD from the URL if it exists
  const params = new URLSearchParams(window.location.search);
  let chosenDate = params.get('date');

  // 2. If no date param, default to today’s date
  if (!chosenDate) {
    const today = new Date();
    // toISOString() is "2025-06-01T12:34:56.789Z" → split at 'T' → "2025-06-01"
    chosenDate = today.toISOString().split('T')[0];
  }

  // 3. Show which date we’re using (optional)
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date();
  const displayDate = today.toLocaleDateString('en-GB', options);
  dateDisplay.textContent = `${displayDate}`;

  // 4. Build the URL (replace with your real endpoint)
  const endpoint = 'https://www.nytimes.com/svc/wordle/v2/';
  const fetchURL = `${endpoint}${encodeURIComponent(chosenDate)}.json`;

  // 5. Fetch JSON { "word": "HELLO" }, then render
  fetch(fetchURL)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Network response was not OK (${res.status})`);
      }
      return res.json();
    })
    .then(data => {
      // Assume the JSON has a “word” key
      const word = data.word?.toString().trim().toUpperCase();
      if (!word || word.length === 0) {
        throw new Error('No “word” found in JSON.');
      }
      // Clear any previous content
      container.innerHTML = '';

      // 6. Render each letter as a “correct” (green) tile
	word.split('').forEach((char, idx) => {
	    const box = document.createElement('div');
	    box.classList.add('letter-box');
	    box.textContent = char;
	    container.appendChild(box);

	    // After appending, wait idx * 300ms, then add “correct” to trigger CSS animation
	    setTimeout(() => {
	      box.classList.add('correct');
	    }, idx * 300);
	  });
    })
    .catch(err => {
      // If something goes wrong (404, JSON parse error, etc.), show a friendly message
      container.innerHTML = `<div style="color:red; font-weight:bold; margin-top:20px;">
        Oops – couldn’t load the word for ${chosenDate}.<br/>
        (${err.message})
      </div>`;
      console.error(err);
    });
