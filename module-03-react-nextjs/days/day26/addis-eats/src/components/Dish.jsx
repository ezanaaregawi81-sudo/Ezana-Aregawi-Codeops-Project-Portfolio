import Card from './Card';
import PropTypes from 'prop-types';
import { useState } from 'react';



function Dish({name, price, category, isSpicy, currency ="ETB", onAddToCart}) {
    

   
 
  return (
   <>
    <div className="dish">
      <Card>
        <h1>{name}: </h1>
        <br />
        <p><small>{category}</small></p>
        <p>{price} {currency}</p>
        <br />
        <p>{isSpicy && <strong> Spicy</strong>}</p>{/*D2:Exercies#2 rendering spicy badge */}
      </Card>
      

      <button onClick={() => onAddToCart(price)}>Add to cart</button>

       {/* <p>Quantity: {count}</p> */}
    </div>
   </>
  )
}


// D2:Exercise#1 Add proptypes 
Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isSpicy: PropTypes.bool
  
}
export default Dish
