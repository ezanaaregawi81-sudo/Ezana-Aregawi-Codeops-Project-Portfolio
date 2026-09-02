import { useState, useMemo, useEffect } from "react";
import "../../public/menu.json";
import CategoryBar from "./CatagoryBar";
import Dish from "./Dish";
import OrderForm from "./OrderForm";

const CATEGORIES = ["All", "Appetizer", "Main", "Breakfast", "Drinks"];


function isValidTelebirr(phone) {
  return /^09\d{8}$/.test(phone.trim());
}

export default function Main() {


  const [dishesData, setDishesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [orderTotal, setOrderTotal] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
  });

  async function fetchData() {
    try {
      const response = await fetch(`menu.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }   
      const data = await response.json();
      console.log("The fetched data", data);
      setDishesData(data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []); // Fetch data when the component mounts or when the category changes

  const filteredDishes = useMemo(() => {
    if (selectedCategory === "All") return dishesData;
    return dishesData.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);
  console.log("Filtered Dishes:", selectedCategory, filteredDishes, dishesData);

console.log("Dishes Data:", dishesData);
  const handleAdd = (dish) => {
    setOrderTotal((prev) => prev + dish.price);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const phoneIsValid = isValidTelebirr(form.phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneIsValid) return;

    alert(
      `Order placed!\nTotal: ${orderTotal} ETB\nName: ${form.name}\nPhone: ${form.phone}\nArea: ${form.area}`
    );

    // Reset
    setOrderTotal(0);
    setForm({ name: "", phone: "", area: "" });
  };

  return (
    <div className="menu">
      <header>
        <h1>Addis Eats</h1>
        <p className="order-total">Order Total: <strong>{orderTotal} ETB</strong></p>
      </header>

      <CategoryBar
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      

      {filteredDishes.map((dish) => (
        <Dish key={dish.id} dishes={filteredDishes} onAdd={handleAdd} />
      ))}

      <OrderForm
        form={form}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        isValid={phoneIsValid && form.name.trim() !== "" && form.area.trim() !== ""}
      />
    </div>
  );
}