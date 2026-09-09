export function validateField(name, value) {
  const trimmedValue = typeof value === "string" ? value.trim() : "";

  if (name === "name") {
    return trimmedValue ? "" : "Enter your full name.";
  }

  if (name === "phone") {
    return /^09\d{8}$/.test(trimmedValue) ? "" : "Enter a valid Telebirr number (09xxxxxxxx).";
  }

  if (name === "area") {
    return trimmedValue ? "" : "Enter your area or location.";
  }

  return "";
}

export function validateForm(form) {
  return {
    name: validateField("name", form.name),
    phone: validateField("phone", form.phone),
    area: validateField("area", form.area),
  };
}
