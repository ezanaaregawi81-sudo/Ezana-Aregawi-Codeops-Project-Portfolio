    function save(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to save data:", err);
      }
    }

    function load(key) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return [];                  
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];   
      } catch (err) {
        console.error("Failed to load or parse data:", err);
        return [];
      }
    }

    const form = document.getElementById("signup-form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const errorEl = document.getElementById("error");
    const countEl = document.getElementById("count");

    const phoneRegex = /^(?:\+251|0)9\d{8}$/;

 
    function updateCount() {
      const entries = load("signups");
      countEl.textContent = entries.length;
    }
    updateCount();
    form.addEventListener("submit", (event) => {
      event.preventDefault(); 
      
      errorEl.textContent = "";
      errorEl.style.color = "";

      // Read and trim values
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();

      // Validation – show the FIRST problem found
      if (name.length < 2) {
        errorEl.textContent = "Name must be at least 2 characters long.";
        return;
      }

      if (!phoneRegex.test(phone)) {
        errorEl.textContent =
          "Please enter a valid Ethiopian phone number (e.g. 0912345678 or +251912345678).";
        return;
      }

      // ----- Success path -----
      const entries = load("signups");
      entries.push({
        name: name,
        phone: phone,
        signedUpAt: new Date().toISOString()
      });
      save("signups", entries);

      // Clear the form
      form.reset();

      // Update the displayed count
      updateCount();

      // Temporary success message
      errorEl.style.color = "var(--success)";
      errorEl.textContent = "Successfully signed up!";
      setTimeout(() => {
        errorEl.textContent = "";
        errorEl.style.color = "";
      }, 2500);
    });