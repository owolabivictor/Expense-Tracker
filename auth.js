import { SUPABASE_KEY, SUPABASE_URL } from "./js/config.js";

const loginBtn = document.querySelectorAll(".login");
const signUp = document.querySelectorAll(".sign-up");
const formSignUp = document.getElementById("sign-up");
const signUpBtn = document.getElementById("sign-up-btn");
export const messageDiv = document.getElementById("message");

const passwordRevealer = document.querySelectorAll(".password-reveal");

// LOGIN OPTION
loginBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("sign-up").classList.add("hide");
    document.getElementById("login").classList.remove("hide");
    document.querySelector(".option-login").classList.add("selected");
    document.querySelector(".option-sign-up").classList.remove("selected");
  });
});

//SIGN-UP OPTION
signUp.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("sign-up").classList.remove("hide");
    document.getElementById("login").classList.add("hide");
    document.querySelector(".option-sign-up").classList.add("selected");
    document.querySelector(".option-login").classList.remove("selected");
  });
});

// Registration
formSignUp.addEventListener("submit", handleSignUp);

function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById("sign-up-name");
  const email = document.getElementById("sign-up-email");
  const password = document.getElementById("sign-up-password");

  const inputFields = [name, email];

  const fieldsOk = areFieldsFilled(inputFields);
  const passwordOk = checkPasswordLength(password);

  if (!fieldsOk || !passwordOk) return;

  signUpBtn.innerHTML = "Creating Account...";
  signUpBtn.style.opacity = "0.6";
  signUpBtn.disabled = true;
  signUpBtn.style.cursor = "not-allowed";

  const newUser = {
    email: email.value.trim(),
    password: password.value.trim(),
    data: {
      full_name: name.value.trim(),
    },
  };
  createNewUser(newUser);
}

// Create a new user
async function createNewUser(newUser) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed attempt! Try again");
    }
    const data = await response.json();

    showSuccess("Account created successfully!");
  } catch (error) {
    console.log(error);
    showError("Failed attempt! Try again");
  } finally {
    signUpBtn.innerHTML = `Create Account Free <i class="fa fa-arrow-right"></i>`;
    signUpBtn.style.opacity = "1";
    signUpBtn.disabled = false;
    signUpBtn.style.cursor = "pointer";
  }
}

// Check Empty Input Function
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
function checkPasswordLength(password) {
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

//Success message
export function showSuccess(message) {
  messageDiv.style.display = "block";
  messageDiv.innerHTML = `<i class="fa fa-check"></i> ${message}`;
  messageDiv.style.color = "#01554e";
  messageDiv.style.backgroundColor = "#eff4ff";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

// Error message
export function showError(message) {
  messageDiv.style.display = "block";
  messageDiv.innerHTML = `<i class="fa fa-xmark"></i> ${message}`;
  messageDiv.style.color = "#CC525F";
  messageDiv.style.backgroundColor = "#FEF2F2";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}
