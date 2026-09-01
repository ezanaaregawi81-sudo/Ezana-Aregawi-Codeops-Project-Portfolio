import Card from './Card';
import PropTypes from 'prop-types';

// Day2 Exercise#1 add prop types
function Dish({name, price, category, isSpicy, currency ="ETB"}) {
    console.log(typeof(price))
  
 
  return (
   <>
    <div className="dish">
      <Card>
        <h1>{name}</h1>
        <br />
        <p><small>{category}</small></p>
        <p>{price} {currency}</p>
        <br />
        <p>{isSpicy && <strong> Spicy</strong>}</p>{/*D2:Exercies#2 rendering spicy badge */}
      </Card>
      {/* D2:Exercies#3 add a card wrapper on Dish */}
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
