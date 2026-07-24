from abc import ABC, abstractmethod
from collections import deque

class BankConfig:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.min_balance = 50
        return cls._instance

class Account(ABC):
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.observers = []

    def attach(self, observer):
        self.observers.append(observer)

    def notify(self):
        for obs in self.observers:
            obs.update(self)

    @abstractmethod
    def get_account_type(self):
        pass

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.notify()
            return True
        return False

    def withdraw(self, amount):
        if amount > 0 and self.balance - amount >= BankConfig().min_balance:
            self.balance -= amount
            self.notify()
            return True
        return False

class SavingsAccount(Account):
    def get_account_type(self):
        return "Savings"

class CheckingAccount(Account):
    def get_account_type(self):
        return "Checking"

class AccountRegistry:
    @staticmethod
    def create_account(account_type: str, owner, balance=0):
        if account_type.lower() == "savings":
            return SavingsAccount(owner, balance)
        elif account_type.lower() == "checking":
            return CheckingAccount(owner, balance)
        raise ValueError("Invalid account type")

class SMSNotifier:
    def update(self, account):
        print(f"[SMS] {account.owner}'s balance updated to {account.balance} ETB")

# Linear Structures

#  List (Array) - Transaction History
transaction_history = []   # O(1) append

#  Dictionary (HashMap) - Customer lookup
customer_records = {}

#  Stack - Undo last transactions (LIFO)
transaction_stack = []

# Queue - Customer service line (FIFO)
service_queue = deque()

def main():
    print("=== Addis Bank System - Day 07 Extension ===\n")
    
    config = BankConfig()
    
    savings = AccountRegistry.create_account("savings", "Almaz Bekele", 1000)
    savings.attach(SMSNotifier())
    
    print("--- Day 07: Linear Data Structures ---")
    
    # List
    transaction_history.append(500)
    transaction_history.append(-200)
    print("Transaction History (List):", transaction_history)
    
    # Dictionary
    customer_records[savings.owner] = savings.balance
    print("Customer Records (Dict):", customer_records)
    
    # Stack
    transaction_stack.append(300)   # push
    print("Stack after push:", transaction_stack)
    last = transaction_stack.pop()  # pop
    print("Undid transaction (Stack):", last)
    
    # Queue
    service_queue.append("Almaz")
    service_queue.append("Dawit")
    print("Queue:", list(service_queue))
    served = service_queue.popleft()
    print("Served customer (Queue):", served)
    
    print("\n--- Bank Operations ---")
    savings.deposit(500)
    savings.withdraw(200)
    
    print(f"\nFinal balance for {savings.owner}: {savings.balance} {config.currency}")

if __name__ == "__main__":
    main()