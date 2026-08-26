import React from 'react'

function Dish(prop) {
  return (
    <div className='card'>
        <h1>{prop.name}</h1>
        <p>{prop.price}</p>
        <p><span>{prop.ingeridient}</span></p>
    </div>
  )
}

export default Dish
