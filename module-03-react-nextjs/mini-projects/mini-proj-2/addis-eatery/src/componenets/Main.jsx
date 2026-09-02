import Dish from "./Dish";

const menu = [
    {id: 1, name: "DoroWat", price: "120", category: "Main-dish", isSpicy: true},
    {id: 2, name: "Firfir", price: "150", category: "Side-dish", isSpicy: false},
    {id: 3, name: "Chechebsa", price: "175", category: "Main-dish", isSpicy: false},
    {id: 4, name: "Injera", price: "120", category: "Main-dish", isSpicy: true},
    {id: 5, name: "Salad", price: "150", category: "Side-dish", isSpicy: false},
    {id: 6, name: "Pizza", price: "175", category: "Main-dish", isSpicy: false},
    {id: 7, name: "Hummus", price: "120", category: "Main-dish", isSpicy: true},
    {id: 8, name: "DoroWat", price: "150", category: "Side-dish", isSpicy: false},
    {id: 9, name: "Tibs", price: "175", category: "Main-dish", isSpicy: false}
]
let mains=menu.filter((dish)=>dish.category=="Main-dish")
let sides=menu.filter((dish)=>dish.category=="Side-dish")

function Main() {
  return (
    <main className="menu-container">
        <div className="main">
        <h1>main dishes</h1>
      {mains.map((dish, index) => (
        <Dish
          key={index}
          name={dish.name}
          price={dish.price}
          catagory={dish.catagory}
          isSpicy={dish.isSpicy}
        />
      ))}
      </div>
      <div className="side">
        <h1>side dishes</h1>
        {sides.map((item)=>(
            <Dish
            key={item.id}
            name={item.name}
            price={item.price}
            catagory={item.catagory}
            isSpicy={item.isSpicy}
            />
            
        ))}
        
      </div>
    </main>
  )
}

export default Main