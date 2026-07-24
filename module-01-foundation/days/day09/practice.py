from collections import deque
import heapq


# 1. Build a BST
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root


def in_order(root):
    if root is None:
        return []
    return in_order(root.left) + [root.val] + in_order(root.right)


balances = [500.0, 150.0, 750.0, 100.0, 300.0, 600.0, 900.0]
root = None
for b in balances:
    root = insert(root, b)

print("In-order BST:", in_order(root))


# 2. Tree depth
def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


print("Tree height:", height(root))


# 3. Graph BFS
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}


def bfs(graph, start):
    visited_set = {start}
    queue = deque([start])
    visit_order = []

    while queue:
        vertex = queue.popleft()
        visit_order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited_set:
                visited_set.add(neighbor)
                queue.append(neighbor)

    return visit_order, visited_set


bfs_order, bfs_reachable = bfs(graph, "A")
print("BFS visit order:", bfs_order)
print("BFS reachable set:", bfs_reachable)


# 4. Graph DFS
def dfs(graph, start, visited=None, visit_order=None):
    if visited is None:
        visited = set()
    if visit_order is None:
        visit_order = []

    visited.add(start)
    visit_order.append(start)

    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited, visit_order)

    return visit_order, visited


dfs_order, dfs_reachable = dfs(graph, "A")
print("DFS visit order:", dfs_order)
print("DFS reachable set:", dfs_reachable)


# 5. Priority queue
tasks = [
    (3, "Task C"),
    (1, "Task A"),
    (5, "Task E"),
    (2, "Task B"),
    (4, "Task D")
]

pq = []
for task in tasks:
    heapq.heappush(pq, task)

print("Priority Queue output:")
while pq:
    print(heapq.heappop(pq))
