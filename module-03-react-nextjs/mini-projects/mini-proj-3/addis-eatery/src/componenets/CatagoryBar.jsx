export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${selected === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}