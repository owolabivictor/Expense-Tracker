const messageDiv = document.getElementById("message");
const passwordRevealer = document.querySelectorAll(".password-reveal");

//Success message
export function showSuccess(message) {
  messageDiv.style.display = "block";
  messageDiv.innerHTML = `<i class="fa fa-check"></i> ${message}`;
  messageDiv.style.color = "#01554e";
  messageDiv.style.backgroundColor = "#eff4ff";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 1500);
}

// Error message
export function showError(message) {
  messageDiv.style.display = "block";
  messageDiv.innerHTML = `<i class="fa fa-xmark"></i> ${message}`;
  messageDiv.style.color = "#CC525F";
  messageDiv.style.backgroundColor = "#FEF2F2";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 2500);
}

// Check empty fields
export function areFieldsFilled(array) {
  let areFieldsFilled = true;

  array.forEach((input) => {
    const inputContainer = input.closest(".input-container");
    const error = inputContainer.nextElementSibling;
    if (!input.value.trim()) {
      const fieldName = inputContainer.previousElementSibling.textContent;
      error.style.display = "block";
      error.textContent = `Enter a valid ${fieldName.toLowerCase()}`;
      inputContainer.classList.add("invalid");
      areFieldsFilled = false;
    } else {
      error.style.display = "none";
      error.textContent = "";
      inputContainer.classList.remove("invalid");
    }
  });
  return areFieldsFilled;
}

// Check Password Length
export function checkPasswordLength(password) {
  const inputContainer = password.closest(".input-container");
  const error = inputContainer.nextElementSibling;
  if (password.value.trim().length < 8) {
    error.style.display = "block";
    error.textContent = "Password must be at least 8 characters";
    inputContainer.classList.add("invalid");
    return false;
  } else {
    error.style.display = "none";
    error.textContent = "";
    inputContainer.classList.remove("invalid");
    return true;
  }
}

// Show and reveal Password
passwordRevealer.forEach((passwordRevealer) => {
  passwordRevealer.addEventListener("click", (e) => {
    const inputContainer = e.target.previousElementSibling;
    if (e.target.classList.contains("fa-eye-slash")) {
      e.target.classList.remove("fa-eye-slash");
      e.target.classList.add("fa-eye");
      inputContainer.type = "text";
    } else {
      e.target.classList.remove("fa-eye");
      e.target.classList.add("fa-eye-slash");
      inputContainer.type = "password";
    }
  });
});

export function setButtonLoading(btn, text) {
  btn.innerHTML = text;
  btn.style.opacity = "0.6";
  btn.disabled = true;
  btn.style.cursor = "not-allowed";
}

export function resetButton(btn, text) {
  btn.innerHTML = text;
  btn.style.opacity = "1";
  btn.disabled = false;
  btn.style.cursor = "pointer";
}

export function expenseIconSelector(category) {
  switch (category) {
    case "Food":
      return "fa-utensils";
      break;
    case "Transport":
      return "fa-bus";
      break;
    case "Airtime & Data":
      return "fa-wifi";
      break;
    case "Education":
      return "fa-book-open";
      break;
    case "Shopping":
      return "fa-bag-shopping";
      break;
    case "Bills":
      return "fa-file-invoice";
      break;
    case "Health":
      return "fa-heart-pulse";
      break;
    case "Fun":
      return "fa-gamepad";
      break;
    default:
      return "fa-ellipsis";
  }
}

export function nairaFormatter(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

//Handle Empty state
export function showEmptyState() {
  document.getElementById("empty-expenses").style.display = "flex";
  document.querySelector(".spending-limit").style.display = "none";
  document.querySelector(".category").style.display = "none";
}

export function removeEmptyState() {
  document.getElementById("empty-expenses").style.display = "none";
  document.querySelector(".spending-limit").style.display = "flex";
  document.querySelector(".category").style.display = "block";
}
