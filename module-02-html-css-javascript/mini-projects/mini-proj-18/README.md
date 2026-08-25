# TeleBirr Transaction Report

## Description


This project is a small TeleBirr transaction report generator
for an Addis shop.

It processes transaction data using JavaScript array methods
and modern JavaScript features such as filter, map, reduce,
destructuring, spread syntax, and ES modules.

## project structure

## Project Structure
telebirr-transaction-report/

│
├── transactions.js
├── report.js
├── app.js
└── README.md

### transaction.js
Contains the transaction data.

Each transaction has:

- id
- customer
- amount
- type

The type can be either credit or debit.
### `report.js`

Contains the functions and calculations used to process
the transactions.

It uses:

- filter() to separate debit and credit transactions
- reduce() to calculate totals
- map() to create formatted receipt messages
- destructuring to extract object properties
- spread syntax to create an updated transaction

### `app.js`

Imports the transaction data and report functions.

It calls the report functions and prints the final transaction
report to the console.

### `README.md`

Provides documentation about the project and explains
how the modules work.