import Card from "./Card";
import React from "react";

const menu = [
    {name: "DoroWat", price: "120 ETB"},
    {name: "DoroWat", price: "150 ETB"},
    {name: "DoroWat", price: "175 ETB"}
]

function Main(){
    return(
        <>
        <div className="card-container">
            {
                menu.map((item, index) => (
                    <Card key={index} name={item.name} price={item.price}/>
                ))
            }
        </div>
        </>
    )
}

export default Main