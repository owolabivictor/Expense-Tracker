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
  }, 2500);
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
