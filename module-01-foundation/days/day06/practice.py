from abc import ABC, abstractmethod
import math

class Report:
    def __init__(self, title: str, content: str):
        self.title = title
        self.content = content


class ReportBuilder:
    def build(self, title: str, content: str) -> Report:
        return Report(title, content)


class ReportSaver:
    def save(self, report: Report, filename: str):
        print(f"[ReportSaver] Saving report '{report.title}' to '{filename}'.")


class ReportEmailer:
    def send_email(self, report: Report, recipient: str):
        print(f"[ReportEmailer] Sending report '{report.title}' to recipient '{recipient}'.")


def demo_srp():
    print("--- 1. Single Responsibility Principle (SRP) ---")
    builder = ReportBuilder()
    saver = ReportSaver()
    emailer = ReportEmailer()

    report = builder.build("Quarterly Summary", "Sales increased by 20%.")
    saver.save(report, "quarterly_summary.txt")
    emailer.send_email(report, "manager@example.com")
    print()



class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * (self.radius ** 2)


class Square(Shape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side ** 2


class Triangle(Shape):
    def __init__(self, base: float, height: float):
        self.base = base
        self.height = height

    def area(self) -> float:
        return 0.5 * self.base * self.height


def print_area(shape: Shape):
    # Single polymorphic call replacing if/elif logic
    print(f"[OCP] {shape.__class__.__name__} Area: {shape.area():.2f}")


class AppSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance


print("--- 3. Singleton Pattern ---")
app1 = AppSettings()
app2 = AppSettings()

print(f"app1.currency: {app1.currency}")
print(f"app2.currency: {app2.currency}")
print(f"app1 is app2: {app1 is app2}")




class ShapeFactory:
    @staticmethod
    def create(kind: str, **kwargs) -> Shape:
        kind_lower = kind.lower()
        if kind_lower == "circle":
            return Circle(kwargs.get("radius", 1.0))
        elif kind_lower == "square":
            return Square(kwargs.get("side", 1.0))
        elif kind_lower == "triangle":
            return Triangle(kwargs.get("base", 1.0), kwargs.get("height", 1.0))
        else:
            raise ValueError(f"Unknown shape type: '{kind}'")



print("--- 4. Factory Pattern ---")
circle = ShapeFactory.create("circle", radius=7)
square = ShapeFactory.create("square", side=5)
triangle = ShapeFactory.create("triangle", base=4, height=8)

for shape in [circle, square, triangle]:
    print(f"Factory created {shape.__class__.__name__} with Area: {shape.area():.2f}")
print()



class Subscriber(ABC):
    @abstractmethod
    def update(self, news: str):
        pass


class TVChannel(Subscriber):
    def __init__(self, channel_name: str):
        self.channel_name = channel_name

    def update(self, news: str):
        print(f"[{self.channel_name}] Broadcasting News: {news}")


class MobileAppUser(Subscriber):
    def __init__(self, username: str):
        self.username = username

    def update(self, news: str):
        print(f"[Mobile Alert for {self.username}]: {news}")


class NewsAgency:
    def __init__(self):
        self._subscribers = []
        self._latest_news = ""

    def attach(self, subscriber: Subscriber):
        if subscriber not in self._subscribers:
            self._subscribers.append(subscriber)

    def detach(self, subscriber: Subscriber):
        if subscriber in self._subscribers:
            self._subscribers.remove(subscriber)

    def notify(self):
        for subscriber in self._subscribers:
            subscriber.update(self._latest_news)

    def add_news(self, news: str):
        print(f"[NewsAgency] Publishing: '{news}'")
        self._latest_news = news
        self.notify()



print("--- 5. Observer Pattern ---")
agency = NewsAgency()

tv = TVChannel("ETV News")
user = MobileAppUser("Abebe")

agency.attach(tv)
agency.attach(user)

agency.add_news("Tech Conference scheduled in Addis Ababa!")
print()
