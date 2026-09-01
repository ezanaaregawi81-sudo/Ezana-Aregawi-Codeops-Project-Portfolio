import PropTypes from 'prop-types';

const CATEGORIES = ["All", "Main-dish", "Side-dish", "Beverage"];

function CategoryBar({ selected, onSelect }) {
  return (
    <div className="category-bar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
        >
          {cat === "All" ? "All Items" : cat}
        </button>
      ))}
    </div>
  );
}

CategoryBar.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;