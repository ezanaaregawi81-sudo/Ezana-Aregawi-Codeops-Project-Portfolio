customers = {}
while True:
    try:
        amount = int(input('Number of clients to check: '))
        break
    except ValueError:
        print("Invalid input! Please enter an integer.")

for i in range(amount):
    name = input(f"Name of client #{i + 1}: ")
    
    # Catching invalid balance inputs right when they happen
    while True:
        try:
            balance = float(input(f'Balance of client #{i + 1}: '))
            break # Exit the while loop if the float conversion succeeds
        except ValueError:
            print("Invalid balance! Please enter a number.")
            
    customers[name] = balance

def tier():

    premium = 0
    standard = 0
    basic = 0
    print("\n ---Customer tier list---")
    for name, balance in customers.items():
        if balance >= 1000:
            print(f"{name}: premium {balance} ETB")
            premium += 1
        elif balance >= 500:
            print(f"{name}: standard {balance} ETB")
            standard += 1
        else:
            print(f"{name}: basic {balance} ETB")
            basic += 1
    print("\n --Number of customers in every tier--")
    print(f"{premium} customers are premium")
    print(f"{standard} customers are standard")
    print(f"{basic} customers are basic")


tier()