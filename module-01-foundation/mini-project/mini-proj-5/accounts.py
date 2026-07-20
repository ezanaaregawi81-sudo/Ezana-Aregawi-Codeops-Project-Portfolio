class Account:
    
    def __init__(self, owner, account_number, balance):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
    
    @property
    def get_balance(self):
        return self.__balance
    
    @get_balance.setter
    def set_balance(self, value):
        if value < 0:
            raise ValueError("Balance cannot go below zero.")
        self.__balance = value

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount entered must be positive")
        self.set_balance = amount + self.get_balance
  
    
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount entered must be positive")
        if amount > self.get_balance:
            raise ValueError("Insufficient balance")
        self.set_balance(self.get_balance - amount)

    def statement(self):
        print(f"{self.owner}: Account number:{self.account_number} Balance:{self.__balance}$")

class savings_account(Account):
    def __init__(self, owner, account_number, balance, interest_rate):
        super().__init__(owner, account_number, balance)
        self.interest_rate = interest_rate
    
    def add_interest(self):
        interest = self.get_balance * (self.interest_rate / 100)
        self.set_balance =self.get_balance + interest

    def statement(self):
        print(f"[Savings] {self.owner}: Account number {self.account_number} Balance: {self.get_balance}$")

class current_account(Account):
    def __init__(self, owner, account_number, balance, overdraft_limit = 1000):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit
    
    def statement(self):
        print(f"[Current] {self.owner}: Account number {self.account_number} Balance: {self.get_balance}$")
    
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount entered must be positive")
        if amount > self.get_balance + self.overdraft_limit:
            raise ValueError("Overdraft limit exceeded")
        overdraft_account = self.get_balance + self.overdraft_limit
        self.set_balance = overdraft_account - amount

Jack = Account("Jack", "Addis-1", 1000000)
John = savings_account("John", "Addis-2", 5000, 5)
Jane = current_account("Jane", "Addis-3", 2000, 500)

print("\n--Client initial statments--")
Jack.statement()
John.statement()
Jane.statement()

John.deposit(1000)
John.add_interest()
Jane.withdraw(2500)

print("\nDeposited 1000 to John and added interest. Withdrew 2500 from Jane.")
print("\n--Client final statments--")
Jack.statement()
John.statement()
Jane.statement()
