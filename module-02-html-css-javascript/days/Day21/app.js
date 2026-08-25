// ======================
    // 1. Theme Toggle + localStorage
    // ======================
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;

    // Restore theme on load
    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next); // save on change
    });

    // ======================
    // 2. save() and load() helpers
    // ======================
    function save(key, array) {
      try {
        localStorage.setItem(key, JSON.stringify(array));
      } catch (err) {
        console.error("Failed to save:", err);
      }
    }

    function load(key) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return [];           // nothing saved yet
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : []; // guard corrupt data
      } catch (err) {
        console.error("Failed to load or parse:", err);
        return []; // return empty array on any error
      }
    }

    // ======================
    // 3–6. Signup form logic
    // ======================
    const form = document.getElementById("signup-form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const errorEl = document.getElementById("error");
    const countEl = document.getElementById("count");

    // Ethiopian phone regex
    // Accepts: 09xxxxxxxx, 07xxxxxxxx, +2519xxxxxxxx, +2517xxxxxxxx
    const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;

    // Show how many people have signed up (on load)
    function updateCount() {
      const people = load("signups");
      countEl.textContent = people.length;
    }
    updateCount(); // run on page load

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // prevent page reload

      // Clear previous error
      errorEl.textContent = "";

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();

      // Validation – show the FIRST problem found
      if (name.length < 2) {
        errorEl.textContent = "Name must be at least 2 characters long.";
        return;
      }

      if (!ethiopianPhoneRegex.test(phone)) {
        errorEl.textContent = "Please enter a valid Ethiopian phone number (e.g. 0912345678 or +251912345678).";
        return;
      }

      // Success → save to localStorage
      const people = load("signups");
      people.push({
        name,
        phone,
        signedUpAt: new Date().toISOString()
      });
      save("signups", people);

      // Clear the form
      form.reset();

      // Update the counter
      updateCount();

      // Optional success feedback
      errorEl.style.color = "green";
      errorEl.textContent = "Successfully signed up!";
      setTimeout(() => {
        errorEl.textContent = "";
        errorEl.style.color = ""; // reset to error color
      }, 2500);
    });