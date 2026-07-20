def load_stock():
    stock = {}
    try:
        with open("stock.txt", "r") as file:
            for line in file:
                line = line.strip()
                if not line:
                    continue
                item, quantity = line.split(",")
                stock[item] = int(quantity)
    except FileNotFoundError:
        print(f"{"stock.txt"} not found. Starting with empty stock.")
    return stock


def update_stock(stock, item, amount):
    if item not in stock:
        stock[item] = 0
    stock[item] += amount
    if stock[item] < 0:
        stock[item] = 0


def print_low_stock(stock):
    low_stock = {item: qty for item, qty in stock.items() if qty < 10}
    if not low_stock:
        print("No low stock items.")
        return
    print("Low stock (below 10):")
    for item, qty in low_stock.items():
        print(f"  {item}: {qty}")


def save_stock(stock):
    with open("stock.txt", "w") as file:
        for item, quantity in stock.items():
            file.write(f"{item},{quantity}\n")


stock = load_stock()

print("Current stock:")
for item, quantity in stock.items():
    print(f"  {item}: {quantity}")

print_low_stock(stock)

item = input("\nItem to update: ").strip()
try:
    amount = int(input("Amount to add (use negative to reduce): "))
except ValueError:
    print("Invalid amount.")
else:
    update_stock(stock, item, amount)
    print(f"\nUpdated {item} to {stock[item]}")
    print_low_stock(stock)
    save_stock(stock)
    print(f"\nSaved to {"stock.txt"}")
