#  Unique cities
cities = ["Addis", "Bahir Dar", "Addis", "Hawassa", "Bahir Dar", "Mekelle"]
unique_cities = set(cities)
print(unique_cities)
print(len(unique_cities))

#  Price report
groceries = {
    "injera": 50,
    "coffee": 120,
    "sugar": 80,
    "oil": 350,
    "teff": 200,
}
for item, price in groceries.items():
    print(f"{item}: {price} ETB")

# Tax comprehension
prices = [100, 250, 400, 80]
with_tax = [p * 1.15 for p in prices]
print(with_tax)

# Cheap items
cheap = [p for p in prices if p < 200]
print(cheap)

# Write & read
with open("names.txt", "w") as file:
    file.write("Abebe\n")
    file.write("Sara\n")
    file.write("Daniel\n")

with open("names.txt", "r") as file:
    for name in file:
        print(name.strip())

# Safe division
try:
    number = float(input("Enter a denominator: "))
    result = 1000 / number
    print(result)
except ValueError:
    print("Not a valid number.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
