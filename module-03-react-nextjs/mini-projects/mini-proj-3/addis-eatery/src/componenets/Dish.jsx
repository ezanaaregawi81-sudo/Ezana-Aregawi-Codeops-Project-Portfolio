export default function Dish({ dishes, onAdd }) {
  if (dishes.length === 0) {
    return <p className="empty-state">No dishes found in this category.</p>;
  }

  return (
    <ul className="dish-list">
      {dishes.map((dish) => (
        <li key={dish.id} className="dish-card">
          <div className="dish-info">
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <span className="price">{dish.price} ETB</span>
          </div>
          <button onClick={() => onAdd(dish)}>Add</button>
        </li>
      ))}
    </ul>
  );
}