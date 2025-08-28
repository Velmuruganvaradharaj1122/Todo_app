// Select elements
const form = document.getElementById("entry-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const resetBtn = document.getElementById("reset-btn");
const entriesList = document.getElementById("entries-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const filterRadios = document.querySelectorAll("input[name='filter']");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

// Save to localStorage
function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// Update Totals
function updateTotals() {
  let income = entries.filter(e => e.type === "income")
                      .reduce((sum, e) => sum + e.amount, 0);
  let expense = entries.filter(e => e.type === "expense")
                       .reduce((sum, e) => sum + e.amount, 0);

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  netBalanceEl.textContent = `₹${income - expense}`;
}

// Render Entries
function renderEntries() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  entriesList.innerHTML = "";

  const filteredEntries = entries.filter(e => filter === "all" || e.type === filter);

  filteredEntries.forEach(entry => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center border p-3 rounded-lg";
    
    li.innerHTML = `
      <div>
        <p class="font-medium">${entry.description}</p>
        <p class="${entry.type === "income" ? "text-green-600" : "text-red-600"}">
          ${entry.type === "income" ? "+" : "-"}₹${entry.amount}
        </p>
      </div>
      <div class="flex gap-2">
        <button class="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500" onclick="editEntry(${entry.id})">Edit</button>
        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onclick="deleteEntry(${entry.id})">Delete</button>
      </div>
    `;
    entriesList.appendChild(li);
  });

  updateTotals();
}

// Add Entry
form.addEventListener("submit", e => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = form.type.value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount");
    return;
  }

  if (editId) {
    entries = entries.map(e => e.id === editId ? {...e, description, amount, type} : e);
    editId = null;
  } else {
    const newEntry = { 
      id: Date.now(), 
      description, 
      amount, 
      type 
    };
    entries.push(newEntry);
  }

  saveEntries();
  renderEntries();
  form.reset();
});

// Reset form
resetBtn.addEventListener("click", () => form.reset());

// Edit entry
function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  descInput.value = entry.description;
  amountInput.value = entry.amount;
  form.type.value = entry.type;
  editId = id;
}

// Delete entry
function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveEntries();
  renderEntries();
}

// Filter change
filterRadios.forEach(r => {
  r.addEventListener("change", renderEntries);
});

// Init
renderEntries();
