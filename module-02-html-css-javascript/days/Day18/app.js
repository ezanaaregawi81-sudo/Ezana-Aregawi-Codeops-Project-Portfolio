// --Number 1
const prices = [100, 500, 600, 800, 1200];

const addvat = prices.map((price) => (price * 1.15).toFixed(2));
const low_prices = prices.filter(price => price < 1000);
const total = prices.reduce((acc, price) => acc + price, 0);
console.log(`    ---List of prices in ETB---
    ${prices}

    ---Prices after VAT---
    ${addvat}

    ---prices less that 1000---
    ${low_prices}

    Total: ${total}`)

// --Number 2
const customer = {
    name: "Alex smith",
    city: "Dubai",
    balance: 1000,
}

for (const [key, value] of Object.entries(customer)) {
    console.log(`${key}: ${value}`)
}

// --Number 3
const { name, city } = customer;

function greet(name) {
    console.log(`Hello! ${name}`)
}
greet(name)

// --Number 4

const updated_customer = { ...customer, city: "London", phone: "2345###" };
console.log(`Updated_customer city: ${updated_customer.city}, phone: ${updated_customer.phone}`);

// --Number 5
import { withVat, VAT } from "./money.js";
const price = 10000;
const priceWithVat = withVat(price);

console.log(`Price with VAT: ${priceWithVat}
    VAT: ${100 * VAT}%`)

