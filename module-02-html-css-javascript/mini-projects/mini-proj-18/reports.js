import { transactions } from "./transactions.js";

export const debits = transactions.filter(
  ({ type }) => type === "debit"
);

export const credits = transactions.filter(
  ({ type }) => type === "credit"
);


export const totalByType = (txns) =>
  txns.reduce((sum, { amount }) => sum + amount, 0);

export const totalDebit = totalByType(debits);
export const totalCredit = totalByType(credits);

export const formattedReceipts = transactions.map(
  ({ customer, amount, type }) =>`
    Customer: ${customer} | ${type.toUpperCase()} | ${amount} ETB`
);

export const updatedTransaction = {
  ...transactions[1],
  amount: 700,
};