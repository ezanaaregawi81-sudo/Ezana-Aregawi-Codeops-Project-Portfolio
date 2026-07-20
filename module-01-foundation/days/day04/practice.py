#  Create a Book class
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        print(f"{self.title} by {self.author} ({self.pages} pages)")


book1 = Book("Song of Ice and Fire", "George R. R. Martin", 512)
book2 = Book("The Lord of the Rings", "J. R. R. Tolkien", 384)

book1.describe()
book2.describe()

print()

# Create a Product class (private quantity, property getter, validation)
class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity

    @property
    def quantity(self):
        return self.__quantity

    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("Quantity cannot go below zero.")
        self.__quantity = value

    def restock(self, n):
        self.__quantity += n

    def sell(self, n):
        if n > self.__quantity:
            raise ValueError("Not enough stock to sell.")
        self.__quantity -= n

    def describe(self):
        print(f"{self.name}: {self.price} ETB, {self.__quantity} in stock")

# Prove independence — three products, change one only
coffee = Product("Coffee", 120, 50)
injera = Product("Injera", 50, 100)
teff = Product("Teff", 200, 30)

print("Before changes:")
coffee.describe()
injera.describe()
teff.describe()

coffee.sell(10)
coffee.restock(5)

print("\nAfter selling 10 and restocking 5 on coffee only:")
coffee.describe()
injera.describe()
teff.describe()