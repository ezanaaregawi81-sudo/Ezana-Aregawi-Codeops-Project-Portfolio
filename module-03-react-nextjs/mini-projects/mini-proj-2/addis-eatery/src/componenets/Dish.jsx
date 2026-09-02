import React from 'react'
import Card from './Card'
import propTypes from 'prop-types'

function Dish({ id,name, price, catagory, currency="ETB", isSpicy }) {
  return (
        <div className="cards">
    <Card>
      <h3>{name}</h3>
      <p className="price">{price} {currency}</p>
      <p className="category">{catagory}</p>
     <p> {isSpicy &&  'Spicy'}</p>
    
    </Card>
  </div>)
  propTypes={
    name:propTypes.string.isRequired,
    price:propTypes.number.isRequired,
    catagory:propTypes.string.isRequired,
    currency:propTypes.string,
    isSpicy:propTypes.bool,

}
}



export default Dish