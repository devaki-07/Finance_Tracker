const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionsDiv = document.getElementById("transactions");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const alertBox = document.getElementById("budget-alert");

/* ===== LocalStorage ===== */
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let income = 0;
let expense = 0;

/* ===== Chart ===== */
let expenseLabels = [];
let expenseAmounts = [];

const ctx = document.getElementById("expenseChart");

const expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: expenseLabels,
    datasets: [{
      data: expenseAmounts,
      backgroundColor: ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7"]
    }]
  }
});

/* ===== Load ===== */
window.onload = () => {
  reloadUI();
};

/* ===== Add Transaction ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  transactions.push({ desc, amount, type });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  descInput.value = "";
  amountInput.value = "";
  typeInput.value = "";

  reloadUI();
});

/* ===== UI ===== */
function reloadUI() {
  transactionsDiv.innerHTML = "";
  income = 0;
  expense = 0;
  expenseLabels.length = 0;
  expenseAmounts.length = 0;

  transactions.forEach((t, index) => {
    const div = document.createElement("div");
    div.classList.add("transaction", t.type);

    div.innerHTML = `
      <span>${t.desc}</span>
      <span>
        ${t.type === "income" ? "+" : "-"} ₹${t.amount}
        <button class="delete-btn">X</button>
      </span>
    `;

    div.querySelector(".delete-btn").onclick = () => {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      reloadUI();
    };

    transactionsDiv.appendChild(div);

    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
      expenseLabels.push(t.desc);
      expenseAmounts.push(t.amount);
    }
  });

  expenseChart.update();
  updateSummary();
}

/* ===== Summary ===== */
function updateSummary() {
  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  balance.textContent = income - expense;

  alertBox.style.display = expense > income ? "block" : "none";
}




