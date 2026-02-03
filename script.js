const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionsDiv = document.getElementById("transactions");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const alertBox = document.getElementById("budget-alert");

/* ===== Load from LocalStorage ===== */
let income = Number(localStorage.getItem("income")) || 0;
let expense = Number(localStorage.getItem("expense")) || 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

/* ===== Chart Setup ===== */
let expenseLabels = [];
let expenseAmounts = [];

const ctx = document.getElementById("expenseChart");

let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: expenseLabels,
    datasets: [{
      data: expenseAmounts,
      backgroundColor: [
        "#ff7675",
        "#55efc4",
        "#74b9ff",
        "#ffeaa7",
        "#a29bfe"
      ]
    }]
  }
});

/* ===== Page Load ===== */
window.onload = function () {
  transactions.forEach(t => {
    addTransactionToUI(t.desc, t.amount, t.type);
    if (t.type === "expense") {
      expenseLabels.push(t.desc);
      expenseAmounts.push(t.amount);
    }
  });
  expenseChart.update();
  updateSummary();
};

/* ===== Add Transaction ===== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!desc || !amount || !type) {
    alert("Please fill all fields");
    return;
  }

  addTransactionToUI(desc, amount, type);

  transactions.push({ desc, amount, type });

  if (type === "income") {
    income += amount;
  } else {
    expense += amount;
    expenseLabels.push(desc);
    expenseAmounts.push(amount);
    expenseChart.update();
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("income", income);
  localStorage.setItem("expense", expense);

  updateSummary();

  descInput.value = "";
  amountInput.value = "";
  typeInput.value = "";
});

/* ===== UI Function ===== */
function addTransactionToUI(desc, amount, type) {
  const div = document.createElement("div");
  div.classList.add("transaction", type);
  div.innerHTML = `
    <span>${desc}</span>
    <span>${type === "income" ? "+" : "-"} ₹${amount}</span>
  `;
  transactionsDiv.appendChild(div);
}

/* ===== Summary ===== */
function updateSummary() {
  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  balance.textContent = income - expense;

  if (expense > income) {
    alertBox.style.display = "block";
  } else {
    alertBox.style.display = "none";
  }
}


