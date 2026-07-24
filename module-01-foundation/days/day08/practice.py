import random


def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])


def count_down(n):
    if n <= 0:
        return
    print(n)
    count_down(n - 1)


print("Total:", total([1, 2, 3, 4, 5]))
print("Count down:")
count_down(5)

def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


balances = [100.0, 250.5, 500.0, 1200.0, 3500.0]
print("Index of 500.0:", binary_search(balances, 500.0))
print("Index of 999.0:", binary_search(balances, 999.0))


def merge(left, right):
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)


random_list = [random.randint(1, 100) for _ in range(10)]
sorted_by_merge = merge_sort(random_list)
sorted_by_builtin = sorted(random_list)
print("Merge sort output:", sorted_by_merge)
print("Matches built-in sorted():", sorted_by_merge == sorted_by_builtin)


accounts = [("Alice", 250.0), ("Bob", 1200.0), ("Charlie", 500.0)]
sorted_accounts = sorted(accounts, key=lambda item: item[1], reverse=True)
print("Sorted by balance descending:", sorted_accounts)


def has_pair(nums, target):
    left = 0
    right = len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return False


sorted_nums = [10, 20, 35, 50, 75, 80]
print("Has pair for 70:", has_pair(sorted_nums, 70))
print("Has pair for 100:", has_pair(sorted_nums, 100))
