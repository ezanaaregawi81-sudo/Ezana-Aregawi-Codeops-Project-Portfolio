# A function that checks and lables temprature
def temp_lbl (temp):
    if temp < 15:
        print(f"{temp} is cold")
    elif temp >= 15 and temp < 28:
        print(f"{temp} is warm")
    else:
        print(f"{temp} is hot")

def Reciept_loop():
    for rpt in range(1,11):
        print(f'Recipt number {rpt}\n')


def Even_check(num):
    if num % 2 == 0:
        print(f"The number {num} is even")
    elif num % 2 != 0:
        print(f"The number {num} is not even")

def apply_discount(price, percent=10):
    percent_in_decimal = float(percent / 100)
    discount_price = price * percent_in_decimal
    new_price = price - discount_price

    print(f"The discont price is {new_price}")
count = 5
while True:
    if count > 0:
        print(f"{count}")
        count -= 1
    elif count == 0:
        print("Lift off!")
        break
    else:
        break
