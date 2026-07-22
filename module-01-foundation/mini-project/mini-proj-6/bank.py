from abc import ABC, abstractmethod
import copy

#  Creational Pattern: Singleton
class BankConfig:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.interest_rate = 0.15
            cls._instance.min_balance = 50
        return cls._instance

# SOLID + Creational : Factory
class Account(ABC):
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.observers = []   # For Observer Pattern

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

#  Concrete Accounts (OCP + LSP)
class SavingsAccount(Account):
    def get_account_type(self):
        return "Savings"

class CheckingAccount(Account):
    def get_account_type(self):
        return "Checking"

class AccountFactory:
    """Factory Pattern - Creational"""
    @staticmethod
    def create_account(account_type: str, owner, balance=0):
        if account_type.lower() == "savings":
            return SavingsAccount(owner, balance)
        elif account_type.lower() == "checking":
            return CheckingAccount(owner, balance)
        raise ValueError("Invalid account type")

# ISP + DIP
class Notifier(ABC):
    @abstractmethod
    def update(self, account): pass

class SMSNotifier(Notifier):
    def update(self, account):
        print(f"[SMS] {account.owner}'s {account.get_account_type()} balance: {account.balance} ETB")

class EmailNotifier(Notifier):
    def update(self, account):
        print(f"[EMAIL] Notification sent to {account.owner}")

def main():
    config = BankConfig()  # Singleton
    
    print("=== Addis Bank System (Day 06 Version) ===\n")
    
    # Factory in action
    savings = AccountFactory.create_account("savings", "Almaz Bekele", 1000)
    checking = AccountFactory.create_account("checking", "Dawit Tesfaye", 500)
    
    print(f"\n observers {savings.observers}")
    # Observer Pattern
    savings.attach(SMSNotifier())
    savings.attach(EmailNotifier())
    print(f"\n observers {savings.observers}")
    
    print("Initial balances:")
    print(f"{savings.owner}: {savings.balance} ETB ({savings.get_account_type()})")
    print(f"{checking.owner}: {checking.balance} ETB ({checking.get_account_type()})")
    print(f"\n observers {savings.observers}")
    # Operations
    savings.deposit(500)
    savings.withdraw(200)
    
  
    checking.deposit(300)

    print("\nFinal balances:")
    print(f"{savings.owner}: {savings.balance} {config.currency} ({savings.get_account_type()})")
    print(f"{checking.owner}: {checking.balance} {config.currency} ({checking.get_account_type()})")

if __name__ == "__main__":
    main()