import Dish from "./Dish";

const menu = [
    {id: 1, name: "DoroWat", price: "450", category: "Main-dish", isSpicy: true},
    {id: 2, name: "Firfir", price: "150", category: "Side-dish", isSpicy: true},
    {id: 3, name: "Chechebsa", price: "125", category: "Main-dish", isSpicy: true},
    {id: 4, name: "Keywet", price: "300", category: "Main-dish", isSpicy: true},
    {id: 5, name: "Salad", price: "150", category: "Side-dish", isSpicy: false},
    {id: 6, name: "Kurt", price: "600", category: "Main-dish", isSpicy: false},
    // {id: 7, name: "Ambo", price: "100", category: "Beverage", isSpicy: false},
    // {id: 8, name: "Soft-drinks", price: "80", category: "Beverage", isSpicy: false},
    {id: 9, name: "Shiro", price: "run", category: "Main-dish", isSpicy: true}
]

// D2:Exercies#4 filter by category
let mainCat = menu.filter((item)=> item.category === "Main-dish")
let sideCat = menu.filter((item)=> item.category === "Side-dish")
let bevCat = menu.filter((item)=> item.category === "Beverage")

function Main(){

    return(
        <>
        <h2>Main Courses</h2>
        <div className="card-container">
            
            {/* D2:Exercies#4 show an empty state and render with map */}
            {mainCat?.length === 0
            ?<p>Out of Main Courses</p>
            
            :mainCat.map((item) => (
                    <Dish 
                    key={item.id} 
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    isSpicy={item.isSpicy}
                   
                    />
    
                ))
            }
        </div>

        <h2>Side-dish</h2>
        <div className="card-container">
            
            {
            mainCat?.length === 0
            ?<p>Out of Side Dishes</p>
            
           :sideCat.map((item) => (
                    <Dish 
                    key={item.id} 
                    {...item}
                    />
                ))
            }
        </div>
        <h2>Beverages</h2>
        <div className="card-container">
            
            {bevCat?.length === 0?<p>Out of Beverages</p>// 
              : bevCat.map((item) => (
                    <Dish 
                    key={item.id} 
                    {...item}
                    />
                ))
            }
        </div>


        </>
    )
}

export default Main