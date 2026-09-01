import Card from './Card';
import PropTypes from 'prop-types';
import { useState } from 'react';

function Dish({name, price, category, isSpicy, currency ="ETB", onAddToCart}) {
  
  const [count, setCount] = useState(0)

  function add(){
    setCount(count + 1)
    onAddToCart(price)
  }


 
  return (
   <>
    <div className="dish">
      <Card>
        <h1>{name}: </h1>
        <br />
        <p><small>{category}</small></p>
        <p>{price} {currency}</p>
        <br />
        <p>{isSpicy && <strong> Spicy</strong>}</p>
      </Card>
    


      <button onClick={add}>Add to cart</button>

      

       <p>Quantity: {count}</p>
    </div>
   </>
  )
}


Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isSpicy: PropTypes.bool
  
}
export default Dish
