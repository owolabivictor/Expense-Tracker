import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";
import {
  areFieldsFilled,
  showError,
  showSuccess,
  resetButton,
  setButtonLoading,
} from "./ui.js";
import { saveSession } from "./js/session.js";

const formLogin = document.getElementById("login");
const errorCredentials = document.querySelector(".error-credentials");
const loginBtn = document.getElementById("login-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");

formLogin.addEventListener("submit", handleLogin);

function handleLogin(e) {
  e.preventDefault();

  const inputFields = [email, password];

  const fieldsOk = areFieldsFilled(inputFields);

  if (!fieldsOk) return;
  errorCredentials.style.display = "none";

  setButtonLoading(loginBtn, "Logging in...");

  const user = {
    email: email.value.trim(),
    password: password.value.trim(),
  };
  loginUser(user);
}

async function loginUser(user) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      },
    );

    if (!response.ok) {
      if (response.status === 400) {
        errorCredentials.style.display = "block";
        return;
      }
      throw new Error("Login failed. Try again");
    }

    const data = await response.json();
    saveSession(data);
    showSuccess("Login successfully!");

    setTimeout(() => {
      window.location.href = "pages/dashboard.html";
    }, 3000);
  } catch (error) {
    errorCredentials.style.display = "none";
    showError("Failed attempt! Try again");
  } finally {
    resetButton(loginBtn, `Log In <i class="fa fa-arrow-right"></i>`);
  }
}
