import format, { withVat, VAT } from "./pricing.js";
import orders from "./orders.js";

const ordersWithVat = orders.map(order => {
    const total = order.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalWithVat = withVat(total);
    return {
        ...order,
        total,
        totalWithVat
    };
});

function summary_receipt() {
    ordersWithVat.forEach(order => {
        console.log(`Order ID: ${order.id}`);
        console.log(`Customer Name: ${order.name}`);
        console.log("Items:");
        order.items.forEach(item => {
            console.log(`  - ${item.type}: ${item.qty} x ${format(item.price)}`);
        });
        console.log(`Total: ${format(order.total)}`);
        console.log(`Total with VAT: ${order.totalWithVat}`);
        console.log('-------------------------');
    });
}

summary_receipt();
