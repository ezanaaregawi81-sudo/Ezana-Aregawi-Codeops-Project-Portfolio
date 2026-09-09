// cartReducer.js
export function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.dish] };
    case "remove": {
      if (action.index !== undefined) {
        return { items: state.items.filter((_, index) => index !== action.index) };
      }
      const removeIndex = state.items.findIndex((d) => d.id === action.id);
      if (removeIndex !== -1) {
        return { items: state.items.filter((_, index) => index !== removeIndex) };
      }
      return state;
    }
    case "clear":
      return { items: [] };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export default cartReducer;
