from abc import ABC, abstractmethod


class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.min_balance = 50
        return cls._instance


class Account(ABC):
    def __init__(self, account_number, owner, balance=0):
        self.account_number = account_number
        self.owner = owner
        self.balance = balance
        self.observers = []
        self.transactions = []

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
            self.transactions.append(amount)
            self.notify()
            return True
        return False

    def withdraw(self, amount):
        if amount > 0 and self.balance - amount >= BankConfig().min_balance:
            self.balance -= amount
            self.transactions.append(-amount)
            self.notify()
            return True
        return False


class SavingsAccount(Account):
    def get_account_type(self):
        return "Savings"


class CheckingAccount(Account):
    def get_account_type(self):
        return "Checking"


def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


class AccountRegistry:
    def __init__(self):
        self.by_number = {}

    def create_account(self, account_type: str, account_number, owner, balance=0):
        if account_type.lower() == "savings":
            acct = SavingsAccount(account_number, owner, balance)
        elif account_type.lower() == "checking":
            acct = CheckingAccount(account_number, owner, balance)
        else:
            raise ValueError("Invalid account type")

        self.by_number[account_number] = acct
        return acct

    def top_by_balance(self, n=5):
        accts = sorted(self.by_number.values(), key=lambda a: a.balance, reverse=True)
        return accts[:n]

    def find_by_number(self, number):
        nums = sorted(self.by_number.keys())
        i = binary_search(nums, number)
        return self.by_number[nums[i]] if i >= 0 else None

    def total_transactions(self, number):
        acct = self.find_by_number(number)
        if not acct:
            return 0
        return self._sum_recursive(acct.transactions)

    def _sum_recursive(self, txs):
        if not txs:
            return 0
        return txs[0] + self._sum_recursive(txs[1:])


class SMSNotifier:
    def update(self, account):
        print(f"[SMS] Account {account.account_number} ({account.owner}): Balance = {account.balance} ETB")


def main():
    registry = AccountRegistry()

    acc1 = registry.create_account("savings", 1003, "Almaz Bekele", 1000)
    acc2 = registry.create_account("checking", 1001, "Dawit Tadesse", 2500)
    acc3 = registry.create_account("savings", 1005, "Bethlehem Hailu", 1500)
    acc4 = registry.create_account("checking", 1002, "Ermias Girma", 800)
    acc5 = registry.create_account("savings", 1004, "Solomon Worku", 3000)

    acc1.deposit(500)
    acc1.withdraw(200)

    acc2.deposit(1000)
    acc2.withdraw(300)

    print("--- Top 3 Accounts by Balance ---")
    top_3 = registry.top_by_balance(3)
    for acc in top_3:
        print(f"{acc.owner} (Acc #{acc.account_number}): {acc.balance} ETB")

    print("\n--- Binary Search Lookup ---")
    found_acc = registry.find_by_number(1002)
    if found_acc:
        print(f"Found Account #1002: {found_acc.owner}, Balance: {found_acc.balance} ETB")
    else:
        print("Account #1002 not found")

    missing_acc = registry.find_by_number(9999)
    print("Account #9999 search result:", missing_acc)

    print("\n--- Recursive Total Transactions ---")
    total_tx1 = registry.total_transactions(1001)
    print(f"Net transaction total for Acc #1001 ({acc2.owner}): {total_tx1} ETB")


if __name__ == "__main__":
    main()
