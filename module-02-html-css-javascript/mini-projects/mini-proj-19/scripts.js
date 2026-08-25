const form = document.getElementById('item-form');
const nameInput = document.getElementById('item-name');
const priceInput = document.getElementById('item-price');
const shoppingList = document.getElementById('shopping-list');
const emptyState = document.getElementById('empty-state');
const totalAmountEl = document.getElementById('total-amount');

let items = []; 


function createItemRow(item) {
  const li = document.createElement('li');
  li.className = 'shopping-item';
  li.dataset.id = item.id; // links this DOM node back to the array entry

  const nameSpan = document.createElement('span');
  nameSpan.className = 'item-name';
  nameSpan.textContent = item.name;

  const priceSpan = document.createElement('span');
  priceSpan.className = 'item-price';
  priceSpan.textContent = `${item.price.toFixed(2)} ETB`;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn toggle-btn';
  toggleBtn.type = 'button';
  toggleBtn.textContent = 'Buy';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';

  li.append(nameSpan, priceSpan, toggleBtn, deleteBtn);
  return li;
}


let nextId = 1; 

form.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  
  if (!name || isNaN (price) || price < 80) {
    alert ("the price should be more than 80"); 
    return;
  };

  const newItem = { id: nextId++, name, price, bought: false };
  items.push(newItem);

  const row = createItemRow(newItem);
  shoppingList.append(row); 
  form.reset();
  nameInput.focus();

  updateTotal();
  toggleEmptyState();
});

shoppingList.addEventListener('click', (event) => {
event.preventDefault();

const row = event.target.closest('li'); 
  if (!row) return;
  const id = Number(row.dataset.id);

  if (event.target.classList.contains('delete-btn')) {
  
    items = items.filter((item) => item.id !== id);
   
    row.remove();

    updateTotal();
    toggleEmptyState();
    return;
  }

  if (event.target.classList.contains('toggle-btn')) {
    const item = items.find((item) => item.id === id);
    item.bought = !item.bought;
    row.classList.toggle('Buy'); // CSS handles the visual styling
    return;
  }
  console.log()
});

function updateTotal() {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  totalAmountEl.textContent = total.toFixed(2);
  console.log(total)
}

function toggleEmptyState() {
  emptyState.style.display = items.length === 0 ? 'block' : 'none';
}