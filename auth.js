import { SUPABASE_KEY, SUPABASE_URL } from "./js/config.js";
import {
  showError,
  showSuccess,
  areFieldsFilled,
  checkPasswordLength,
  setButtonLoading,
  resetButton,
} from "./js/ui.js";

const loginBtn = document.querySelectorAll(".login");
const signUp = document.querySelectorAll(".sign-up");
const formSignUp = document.getElementById("sign-up");
const signUpBtn = document.getElementById("sign-up-btn");

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

  setButtonLoading(signUpBtn, "Creating Account...");

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
    setTimeout(() => {
      document.querySelector(".option-login").click();
    }, 2500);
  } catch (error) {
    console.log(error);
    showError("Failed attempt! Try again");
  } finally {
    resetButton(
      signUpBtn,
      `Create Account Free <i class="fa fa-arrow-right"></i>`,
    );
  }
}
