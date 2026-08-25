const bill = '2500';
let partysize = '5';
let tip_rate = null;

console.log(`Total bill ${bill}`)
console.log(`Party size ${partysize}`)
Number(bill) / Number(partysize);
if (Number(bill) < 300) {
  tip_rate = 0.10;
} else {
  tip_rate = 0.05;
}
let total_bill = Number(bill) + (Number(bill) * tip_rate);
bill_per_person = Number(total_bill) / Number(partysize);

console.log(`The Total_bill with tip is ${total_bill}`);
console.log(`Bill per person is (only tip) ${bill_per_person}`);

payment_method = 'telebir';
switch(payment_method){
    case 'telebir':
        fee = total_bill * 0.01
        break
    case 'cbe birr':
        fee = total_bill * 0.02
        break
    default:
        fee = 0
        break
}
total_bill = Number(bill) + (Number(bill) * tip_rate) + fee;
bill_per_person = Number(total_bill) / Number(partysize);

console.log(`The Total_bill with tip and fee is ${total_bill}`);

console.log(`Bill per person is (tip + fee) ${bill_per_person}`);
console.log(`Service fee for ${payment_method} is ${fee}`);
