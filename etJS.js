let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM elements
const form = document.getElementById('form');
const expenseList = document.getElementById('expense-list');
const filterMonthInput = document.getElementById('filter-month');
const filterCategoryInput = document.getElementById('filter-category');
const reportContainer = document.getElementById('report-container');

// Event listener for add expense form submission
form.addEventListener('submit', addExpense);

// Function to add a new expense
function addExpense(e) {
  e.preventDefault();
  const expense = {
    id: generateID(),
    name: text.value.trim(),
    category: category.value.trim(),
    amount: +amount.value,
    date: date.value
  };

  expenses.push(expense);

  addExpenseDOM(expense);
  updateLocalStorage();
  updateReports();

  form.reset();
}

// Function to add expense to the recent expenses
function addExpenseDOM(expense) {
  const item = document.createElement('li');
  item.classList.add('expense-item');
  item.setAttribute('data-id', expense.id);
  item.innerHTML = `
    <div class="expense-info">
      <span class="expense-name">${expense.name}</span>
      <span class="expense-category">[${expense.category}]</span>
      <span class="expense-amount">&#8377;${expense.amount.toFixed(2)}</span>
      <span class="expense-date">${expense.date}</span>
    </div>
    <button class="delete-btn" onclick="removeExpense(event)">X</button>
  `;
  expenseList.appendChild(item);
}

// Function to remove an expense
function removeExpense(event) {
  const item = event.target.closest('.expense-item');
  if (!item) return;
  const expenseId = item.dataset.id;
  expenses = expenses.filter(expense => expense.id !== expenseId);
  updateLocalStorage();
  item.remove();
  updateReports();
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to update expense reports
function updateReports(expensesList = expenses) {
  const totalExpenses = expensesList.reduce((acc, expense) => acc + expense.amount, 0);

  const reportHTML = `
    <h2>Expense Report</h2><br>
    <p>Total Expenses: &#8377;${totalExpenses.toFixed(2)}</p>
    <p>Number of Expenses: ${expensesList.length}</p>
  `;
  reportContainer.innerHTML = reportHTML;
}


// Function to filter expenses by month
function filterByMonth() {
  const selectedMonth = filterMonthInput.value;
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.toISOString().slice(0, 7) === selectedMonth;
  });

  displayFilteredExpenses(filteredExpenses);
  updateReports(filteredExpenses); // Update report whenever filtered
}
// Function to filter expenses by category
function filterByCategory() {
  const selectedCategory = filterCategoryInput.value.trim().toLowerCase();
  const filteredExpenses = expenses.filter(expense => 
    expense.category.toLowerCase().includes(selectedCategory)
  );

  displayFilteredExpenses(filteredExpenses);
  updateReports(filteredExpenses); // Update report whenever filtered
}
// Function to display filtered expenses
function displayFilteredExpenses(filteredExpenses) {
  expenseList.innerHTML = '';
  filteredExpenses.forEach(expense => {
    addExpenseDOM(expense);
  });
}
// Function to display recent 10 expenses
function displayRecentExpenses() {
  const recentExpenses = expenses.slice(-10); // Retrieve the last 10 expenses
  expenseList.innerHTML = '';
  recentExpenses.forEach(expense => {
    addExpenseDOM(expense);
  });
}
// Function to generate a random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Initialize 
function init() {
  const storedExpenses = JSON.parse(localStorage.getItem('expenses'));
  if (storedExpenses) {
    expenses = storedExpenses;
    displayRecentExpenses(); // Display recent 10 expenses on initialization
    updateReports();
  }
}

init();
