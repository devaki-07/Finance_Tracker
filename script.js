const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionsDiv = document.getElementById("transactions");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const alertBox = document.getElementById("budget-alert");

let income = 0;
let expense = 0;

let expenseLabels = [];
let expenseAmounts = [];

let expenseChart = new Chart(document.getElementById("expenseChart"), {
  type: "pie",
  data: {
    labels: expenseLabels,
    datasets: [
      {
        data: expenseAmounts,
        backgroundColor: [
          "#ff7675",
          "#55efc4",
          "#74b9ff",
          "#ffeaa7",
          "#a29bfe"
        ],
      },
    ],
  },
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!desc || !amount || !type) {
    alert("Please fill all fields");
    return;
  }

  const div = document.createElement("div");
  div.classList.add("transaction", type);
  div.innerHTML = `
      <span>${desc}</span>
      <span>${type === "income" ? "+" : "-"} ₹${amount}</span>
  `;
  transactionsDiv.appendChild(div);

  if (type === "income") {
    income += amount;
  } else {
    expense += amount;
    updateExpenseChart(desc, amount);
  }

  updateSummary();

  descInput.value = "";
  amountInput.value = "";
  typeInput.value = "";
});


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

function updateExpenseChart(label, amount) {
  expenseLabels.push(label);
  expenseAmounts.push(amount);
  expenseChart.update();
}
