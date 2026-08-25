import { transactions } from "./transactions.js";
import {
  debits,
  credits,
  totalDebit,
  totalCredit,
  formattedReceipts,
  updatedTransaction,
} from "./report.js";

function printReport() {
  console.log("========= TeleBirr Transaction Report =========\n");

  console.log("All Transactions:");
  console.table(transactions);

  console.log("Debit Transactions:");
  console.table(debits);

  console.log("Credit Transactions:");
  console.table(credits);

  console.log(`Total Debit : ${totalDebit} ETB`);
  console.log(`Total Credit: ${totalCredit} ETB`);

  console.log("\nFormatted Receipts:");
  formattedReceipts.forEach((receipt) => console.log(receipt));

  console.log("\nUpdated Transaction:");
  console.log(updatedTransaction);
}

printReport();