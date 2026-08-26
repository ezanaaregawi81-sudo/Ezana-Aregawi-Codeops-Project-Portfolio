import Header from './components/Header'
import Dish from './components/Dish'
import './App.css'

const menu = [
  {id:1, name: "Tibs", price: "900 ETB", ingredient:"cubed or sliced meat, aromatic vegetables, and spiced butter"},
  {id:1, name: "Tibs", price: "900 ETB", ingredient:"cubed or sliced meat, aromatic vegetables, and spiced butter"},
  {id:1, name: "Tibs", price: "900 ETB", ingredient:"cubed or sliced meat, aromatic vegetables, and spiced butter"},
  {id:1, name: "Tibs", price: "900 ETB", ingredient:"cubed or sliced meat, aromatic vegetables, and spiced butter"},
  {id:1, name: "Tibs", price: "900 ETB", ingredient:"cubed or sliced meat, aromatic vegetables, and spiced butter"},
  ]

function App() {

  return (
    <>
      <Header />
      <div className='card-container'>
      {
        menu.map((item, index) =>(
          <Dish key={index} name={item.name} price = {item.price}
          ingeridient={item.ingredient}/>
        )
        )
      }
      </div>
      <Dish />
    </>
  )
}

export default App
