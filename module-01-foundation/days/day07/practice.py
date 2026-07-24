import time
from collections import deque

# 1. Name the Big-O

# Snippet 1: List Indexing
# Big-O: O(1)
lst = [10, 20, 30, 40]
item = lst[2]

# Snippet 2: Single Loop
# Big-O: O(n)
for x in lst:
    pass

# Snippet 3: Nested Loop
# Big-O: O(n^2)
for i in lst:
    for j in lst:
        pass

# Snippet 4: Dict Lookup
# Big-O: O(1)
d = {"a": 1, "b": 2}
val = d.get("a")

# Snippet 5: Binary Search
# Big-O: O(log n)
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


# 2. List vs. dict lookup
accounts_list = [f"ACC{i}" for i in range(100000)]
accounts_dict = {f"ACC{i}": True for i in range(100000)}
target = "ACC99998"

start = time.time()
target in accounts_list
list_time = time.time() - start

start = time.time()
target in accounts_dict
dict_time = time.time() - start

print(f"List search time: {list_time:.6f} seconds")
print(f"Dict search time: {dict_time:.6f} seconds")


# 3. Build a stack
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0


names = ["Alice", "Bob", "Charlie", "David"]
stack = Stack()
for name in names:
    stack.push(name)

reversed_names = []
while not stack.is_empty():
    reversed_names.append(stack.pop())

print("Original names:", names)
print("Reversed names:", reversed_names)


# 4. Build a queue
bank_line = deque()
customers = ["Customer 1", "Customer 2", "Customer 3", "Customer 4", "Customer 5"]

for customer in customers:
    bank_line.append(customer)

while bank_line:
    served = bank_line.popleft()
    print("Serving:", served)


# 5. Singly linked list
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def print_all(self):
        current = self.head
        while current is not None:
            print(current.data)
            current = current.next


ll = LinkedList()
ll.push_front("Charlie")
ll.push_front("Bob")
ll.push_front("Alice")
ll.print_all()
