import { func } from "prop-types";
import Dish from "./Dish";
import { useState } from "react";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";

const menu = [
    {id: 1, name: "DoroWat", price: "450", category: "Main-dish", isSpicy: true},
    {id: 2, name: "Firfir", price: "150", category: "Side-dish", isSpicy: true},
    {id: 3, name: "Chechebsa", price: "125", category: "Main-dish", isSpicy: true},
    {id: 4, name: "Keywet", price: "300", category: "Main-dish", isSpicy: true},
    {id: 5, name: "Salad", price: "150", category: "Side-dish", isSpicy: false},
    {id: 6, name: "Kurt", price: "600", category: "Main-dish", isSpicy: false},
    {id: 7, name: "Ambo", price: "100", category: "Beverage", isSpicy: false},
    {id: 8, name: "Soft-drinks", price: "80", category: "Beverage", isSpicy: false},
    {id: 9, name: "Shiro", price: "run", category: "Main-dish", isSpicy: true}
]

// D2:Exercies#4 filter by category


function Main(){

    const [category, setCategory] = useState("All");
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0)

   const shown = category === "All" 
    ? menu 
    : menu.filter((item) => item.category === category);

    function handleAddBtn(price){
            setTotal(total + Number(price))
            setCount(count + 1)
    }

    return(
        <>
        <h3>Order Total: {total} ETB</h3>
        <h3>Total Orders: {count} Items</h3>
        
        <CategoryBar selected={category} onSelect={setCategory} />
        
        <h2>{category}</h2>
        
        <div className="card-container">

            
            {shown?.length === 0
            ?<p>Out of {category}</p>
            :shown.map((item) => (
                    <Dish 
                    key={item.id} 
                    {...item}
                    onAddToCart={handleAddBtn}
                    />
                ))
}
        </div>
        <div className="form">            <OrderForm/>   </div>

       
        


        </>
    )
}

export default Main