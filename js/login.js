import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";
import { areFieldsFilled, showError, showSuccess } from "../auth.js";

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

  loginBtn.innerHTML = "Logging in...";
  loginBtn.style.opacity = "0.6";
  loginBtn.disabled = true;
  loginBtn.style.cursor = "not-allowed";

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

    showSuccess("Login successfully!");

    console.log(data);
    // setTimeout(() => {
    //   window.location.href = "dashboard.html";
    // }, 3000);
  } catch (error) {
    errorCredentials.style.display = "none";
    console.log(error);
    showError("Failed attempt! Try again");
  } finally {
    loginBtn.innerHTML = `Log In <i class="fa fa-arrow-right"></i>`;
    loginBtn.style.opacity = "1";
    loginBtn.disabled = false;
    loginBtn.style.cursor = "pointer";
  }
}
