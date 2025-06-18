const form = document.getElementById('transaction-form');
const transactionsDiv = document.getElementById('transactions');
const totalIncomeSpan = document.getElementById('total-income');
const totalExpenseSpan = document.getElementById('total-expense');
const balanceSpan = document.getElementById('balance');
const budgetAlert = document.getElementById('budget-alert');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Chart.js instance
let expenseChart;

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateSummary() {
  let income = 0;
  let expense = 0;
  transactions.forEach(t => {
    if(t.type === 'income') income += t.amount;
    else expense += t.amount;
  });
  totalIncomeSpan.textContent = income.toFixed(2);
  totalExpenseSpan.textContent = expense.toFixed(2);
  const balance = income - expense;
  balanceSpan.textContent = balance.toFixed(2);

  if(expense > income) {
    budgetAlert.style.display = 'block';
  } else {
    budgetAlert.style.display = 'none';
  }
}

function renderTransactions() {
  transactionsDiv.innerHTML = '';
  transactions.forEach((t, i) => {
    const div = document.createElement('div');
    div.classList.add('transaction-item', t.type);
    div.innerHTML = `
  <span style="flex: 1;">${t.desc}</span>
  <span style="flex: 0;">₹${t.amount.toFixed(2)}</span>
  <button onclick="deleteTransaction(${i})" style="margin-left: 6px;">X</button>
`;
    transactionsDiv.appendChild(div);
  });
}


function updateChart() {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const expenseMap = {};
  expenseTransactions.forEach(t => {
    expenseMap[t.desc] = (expenseMap[t.desc] || 0) + t.amount;
  });

  const labels = Object.keys(expenseMap);
  const data = Object.values(expenseMap);

  if(expenseChart) {
    expenseChart.destroy();
  }

  const ctx = document.getElementById('expenseChart').getContext('2d');
  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses',
        data: data,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0',
          '#9966ff', '#ff9f40', '#c9cbcf', '#7acbf9'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
       aspectRatio: 1
    }
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  updateUI();
}

function updateUI() {
  renderTransactions();
  updateSummary();
  updateChart();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if(!desc || isNaN(amount) || amount <= 0 || !type) {
    alert('Please enter valid details.');
    return;
  }

  transactions.push({ desc, amount, type });
  saveTransactions();
  updateUI();
  form.reset();
});

updateUI();
