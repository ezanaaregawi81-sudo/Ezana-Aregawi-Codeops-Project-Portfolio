function Card(prop) {

  return (
   <>
    <div className="card">
        <h1>{prop.name}</h1>
        <p>{prop.price}</p>

    </div>
   </>
  )
}

export default Card
