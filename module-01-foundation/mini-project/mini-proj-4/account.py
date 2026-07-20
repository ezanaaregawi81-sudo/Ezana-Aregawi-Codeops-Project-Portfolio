class Account:
    
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
    
    @property
    def get_balance(self):
        return self.__balance
    
    @get_balance.setter
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount entered must be positive")
        self.__balance += int(amount)
      
    def withdraw(self, amount):
        if amount > self.__balance:
            raise ValueError("Insufficient balance")
        self.__balance -= amount
    def statement(self):
        print(f"{self.owner}: Account number:{self.account_number} Balance:{self.__balance}$")
        
Jack = Account("Jack", "Addis-1", 1000000)
Hlina = Account("Hlina", "Addis-2", 100)

print(f"Jack: Balance {Jack.get_balance}$") 

Jack.deposit = float(input("Enter amount to deposit: ")) 
count = 3
while count > 0:
    print(f"Processing payment {count}")
    count -= 1

print(f"Transaction Successful!\n Your current balance is {Jack.get_balance}$")

print("\n--Client statments--")

Jack.statement()
Hlina.statement()