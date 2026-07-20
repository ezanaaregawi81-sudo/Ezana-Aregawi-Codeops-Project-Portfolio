from abc import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model
    def describe(self):
        pass
    @abstractmethod
    def wheels(self):
        pass

class Car(Vehicle):
    def __init__(self, make, model):
        super().__init__(make, model)
    def describe(self):
        print(f"This car is a {self.make} {self.model}.")
    def wheels(self):
        return 4

class Truck(Vehicle):
    def __init__(self, make, model, payload_capacity):
        super().__init__(make, model)
        self.payload_capacity = payload_capacity
    def describe(self):
        print(f"This truck is a {self.make} {self.model} with a payload capacity of {self.payload_capacity}.")
    def wheels(self):
        return 6
    
def main():
    # my_vehicle = Vehicle("Generic", "Model")  # This will raise an error since Vehicle is abstract
    my_car = Car("Honda", "Civic")
    his_car = Car("Toyota", "Camry")
    my_truck = Truck("Ford", "F-150", 2000)
    her_truck = Truck("Chevrolet", "Silverado", 2500)

    list_of_vehicles = [my_car, his_car, my_truck, her_truck]
    for vehicle in list_of_vehicles:
        vehicle.describe()
        print(f"Number of wheels: {vehicle.wheels()}")
if __name__ == "__main__":
    main()

