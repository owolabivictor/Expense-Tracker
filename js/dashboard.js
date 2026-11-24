import {
  expenseIconSelector,
  nairaFormatter,
  setButtonLoading,
  resetButton,
  showEmptyState,
  removeEmptyState,
  showLoader,
  hideLoader,
} from "./ui.js";
import { getSession, clearSession } from "./session.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const categoryContainer = document.querySelector(".category-list");
const expenseList = document.querySelector(".expense-list");
const totalAmountSpent = document.getElementById("total-amount");
const currentDateSummary = document.getElementById("current-date");
const monthYear = document.getElementById("month-year");

const session = getSession();
if (!session) {
  window.location.replace("../index.html");
}

// Display user greeting
const greetingMessage = document.getElementById("greeting-message");
const firstName = (session?.fullName ?? "").split(" ")[0];

function getGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

greetingMessage.textContent = `${getGreeting(new Date().getHours())}, ${firstName}`;

// Handle logout
setupLogout();

// Expenses
let expenses = [];

// Current date data
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const day = today.getDate();
let monthExpenses = getMonthExpenses(expenses, currentYear, currentMonth);

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayName = days[today.getDay()];

currentDateSummary.textContent = `${dayName}, ${day} ${today.toLocaleString("default", { month: "long" })}`;

monthYear.textContent =
  today.toLocaleString("default", { month: "long" }) + " " + currentYear;

// Display expenses on webpage
function renderExpenses() {
  expenseList.innerHTML = "";
  monthExpenses.forEach((expense) => {
    const date = expense.expense_date.split("-").map(Number);
    const li = document.createElement("li");
    li.innerHTML = `<div class="expense-detail">
                      <div class="expense-logo">
                        <i class="fa-solid ${expenseIconSelector(expense.category)}"></i>
                      </div>
                      <div class="expense-text">
                        <p class="note"></p>
                        <p class="expense-time">${expense.category} &middot; ${todayYesterdayCheck(date, day)} </p>
                      </div>
                    </div>
                    <p class="amount">-${nairaFormatter(expense.amount)}</p>`;
    li.querySelector(".note").textContent = expense.note
      ? expense.note
      : expense.category;

    expenseList.appendChild(li);
  });
  calculateTotalExpense();
  displayTopCategories();
  if (expenses.length !== 0) {
    removeEmptyState();
  }
}

// Format expense date - Today, Yesterday, Other
function todayYesterdayCheck(date, day) {
  if (date[2] === day) {
    return "Today";
  } else if (date[2] === day - 1) {
    return "Yesterday";
  } else {
    return date[2] + " " + today.toLocaleString("default", { month: "short" });
  }
}

// Calculate and  display total expense summary
function calculateTotalExpense() {
  let totalExpense = 0;
  monthExpenses.forEach((expense) => {
    totalExpense += expense.amount;
  });
  totalAmountSpent.textContent = nairaFormatter(totalExpense);
}

function getMonthExpenses(allExpenses, year, month) {
  const monthExpenses = allExpenses.filter((expense) => {
    const date = expense.expense_date.split("-");
    const dateToNumber = date.map(Number);

    return dateToNumber[0] === year && dateToNumber[1] === month;
  });
  return monthExpenses;
}

function displayTopCategories() {
  // Calculate and store each category total
  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  // Convert categoryTotals entries
  const categoryList = Object.entries(categoryTotals);

  // Sort categoryTotals for the top expenses
  categoryList.sort((a, b) => b[1] - a[1]);
  const topCategories = categoryList.slice(0, 4);

  let monthTotal = 0;
  monthExpenses.forEach((expense) => {
    monthTotal += expense.amount;
  });

  categoryContainer.innerHTML = "";
  topCategories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.className = "category-item";
    const percentage = Math.round((category[1] / monthTotal) * 100);
    categoryElement.innerHTML = `
      <div class="category-name-amount">
        <p>${category[0]}</p>
        <p>${nairaFormatter(category[1])}</p>
      </div>
      <div class="category-percentage">
        <div class="category-percentage-width"></div>
      </div>  
    `;

    categoryElement.querySelector(".category-percentage-width").style.width =
      `${percentage}%`;

    categoryContainer.append(categoryElement);
  });
}

function setupLogout() {
  const logoutDialog = document.getElementById("logout-dialog");

  // Clicking the Logout button in the header only ASKS the question.
  // showModal() opens the box and dims the rest of the page.
  document.getElementById("logout").addEventListener("click", () => {
    logoutDialog.showModal();
  });

  document.getElementById("logout-cancel").addEventListener("click", () => {
    logoutDialog.close();
  });

  document.getElementById("logout-confirm").addEventListener("click", () => {
    clearSession();
    window.location.replace("../index.html");
  });
}

// ---------- Add expense sheet and code ----------
const overlay = document.getElementById("sheet-overlay");
const form = document.getElementById("expense-form");
const formError = document.getElementById("form-error");
const saveBtn = document.getElementById("sheet-save");

function openSheet() {
  form.reset(); // clear anything typed last time
  formError.textContent = "";
  form.elements.date.value = new Date().toLocaleDateString("en-CA"); // today as YYYY-MM-DD
  overlay.classList.add("open"); // the CSS slides it up
}

function closeSheet() {
  overlay.classList.remove("open");
}

document.getElementById("addExpense").addEventListener("click", openSheet);
document.getElementById("empty-add").addEventListener("click", openSheet);
document.getElementById("sheet-close").addEventListener("click", closeSheet);

// Clicking the dark area (not the white sheet) also closes it
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeSheet();
});

// Recalculate this month's expenses and redraw the page
function refreshDashboard() {
  monthExpenses = getMonthExpenses(expenses, currentYear, currentMonth);
  renderExpenses();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = Number(form.elements.amount.value);
  const category = form.elements.category.value;

  if (amount <= 0 || !category) {
    formError.textContent = "Enter an amount and pick a category.";
    return;
  }

  setButtonLoading(saveBtn, "Saving expense...");

  try {
    // Wait for the database to save it first
    const saved = await saveExpense({
      amount,
      category,
      note: form.elements.note.value.trim() || null,
      expense_date: form.elements.date.value,
    });

    // Only after it's saved: add it to the page
    expenses.unshift(saved);
    resetButton(saveBtn, "Saved!");
    setTimeout(() => {
      closeSheet();
      resetButton(saveBtn, "Save expense");
    }, 1000);
    refreshDashboard();
  } catch (error) {
    formError.textContent = "Could not save. Try again.";
    resetButton(saveBtn, "Save expense");
  } finally {
    resetButton(saveBtn, "Save expense");
  }
});

// Send one new expense to the database and return the saved row
async function saveExpense(expense) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/expenses`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY, // gate pass
      Authorization: `Bearer ${session.accessToken}`, // your ID card
      "Content-Type": "application/json",
      Prefer: "return=representation", // asks Supabase to send the saved row back
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Could not save expense");
  }

  const saved = await response.json(); // a list with one row
  return saved[0];
}

async function loadExpenses() {
  showLoader();
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/expenses?select=*&order=expense_date.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load expenses");
  }

  return response.json();
}

async function startDashboard() {
  try {
    expenses = await loadExpenses();
    hideLoader();
    if (expenses.length === 0) {
      showEmptyState();
    } else {
      refreshDashboard();
    }
  } catch (error) {
    console.log(error);
  }
}

if (session) {
  startDashboard();
}
