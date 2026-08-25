const h1 = document.querySelector("h1");
// safest: set plain text
h1.textContent = "Addis Market — Bole";
// classes — prefer this over inline styles
h1.classList.add("active");
h1.classList.remove("hidden");
h1.classList.toggle("done");
// direct style when you must
h1.style.color = "crimson";