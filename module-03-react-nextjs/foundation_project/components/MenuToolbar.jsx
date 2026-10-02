export const SORT_OPTIONS = {
  default: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
};

// Pure markup, used on both sides: disabled inside the prerendered fallback (server)
// and live inside DishFilter (client) once handlers are passed in.
export default function MenuToolbar({ query = '', sort = 'default', onQueryChange, onSortChange }) {
  const live = Boolean(onQueryChange);

  return (
    <section className="toolbar" aria-label="Search and sort">
      <label htmlFor="dish-search" className="visually-hidden">
        Search dishes
      </label>
      <input
        id="dish-search"
        type="search"
        className="search-input"
        placeholder="Search dishes or ingredients..."
        {...(live ? { value: query, onChange: (event) => onQueryChange(event.target.value) } : { defaultValue: '', disabled: true })}
      />
      <div className="toolbar__filters">
        <label htmlFor="dish-sort" className="visually-hidden">
          Sort dishes
        </label>
        <select
          id="dish-sort"
          {...(live ? { value: sort, onChange: (event) => onSortChange(event.target.value) } : { defaultValue: 'default', disabled: true })}
        >
          {Object.entries(SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
