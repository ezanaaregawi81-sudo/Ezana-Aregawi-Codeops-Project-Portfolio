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


class Branch:
    def __init__(self, name):
        self.name = name
        self.children = []
        self.accounts = []

    def total_balance(self):
        total = sum(a.balance for a in self.accounts)
        for child in self.children:
            total += child.total_balance()
        return total


def bfs(transfers, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    reachable = []

    while queue:
        curr = queue.popleft()
        reachable.append(curr)
        for recipient in transfers.get(curr, []):
            if recipient not in visited:
                visited.add(recipient)
                queue.append(recipient)

    return reachable


class SMSNotifier:
    def update(self, account):
        print(f"[SMS] Account {account.account_number} ({account.owner}): Balance = {account.balance} ETB")


def main():
    registry = AccountRegistry()

    acc1 = registry.create_account("savings", 1001, "Almaz Bekele", 1000)
    acc2 = registry.create_account("checking", 1002, "Dawit Tadesse", 2500)
    acc3 = registry.create_account("savings", 1003, "Bethlehem Hailu", 1500)
    acc4 = registry.create_account("checking", 1004, "Ermias Girma", 800)
    acc5 = registry.create_account("savings", 1005, "Solomon Worku", 3000)

    # 3-level Branch Tree: Head Office -> Region -> Branch
    head_office = Branch("Commercial Bank Head Office")
    addis_region = Branch("Addis Ababa Region")
    oromia_region = Branch("Oromia Region")

    bole_branch = Branch("Bole Branch")
    kazanchis_branch = Branch("Kazanchis Branch")
    adama_branch = Branch("Adama Branch")

    head_office.children.extend([addis_region, oromia_region])
    addis_region.children.extend([bole_branch, kazanchis_branch])
    oromia_region.children.append(adama_branch)

    bole_branch.accounts.extend([acc1, acc2])
    kazanchis_branch.accounts.append(acc3)
    adama_branch.accounts.extend([acc4, acc5])

    print("--- Recursive Branch Total Balance ---")
    print(f"{head_office.name} Total Balance: {head_office.total_balance()} ETB")
    print(f"{addis_region.name} Total Balance: {addis_region.total_balance()} ETB")
    print(f"{bole_branch.name} Total Balance: {bole_branch.total_balance()} ETB")

    # Transfers Graph (Account Number -> List of Recipient Account Numbers)
    transfers = {
        1001: [1002, 1003],
        1002: [1004],
        1003: [1005],
        1004: [],
        1005: []
    }

    print("\n--- BFS Transfer Reachability ---")
    start_account = 1001
    reachable = bfs(transfers, start_account)
    print(f"Accounts reachable from #{start_account}: {reachable}")


if __name__ == "__main__":
    main()
