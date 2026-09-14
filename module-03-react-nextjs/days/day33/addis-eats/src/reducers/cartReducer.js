export const INITIAL_CART_STATE = [];

export function cartReducer(state = INITIAL_CART_STATE, action) {
  switch (action.type) {
    case 'ADD': {
      const existingIndex = state.findIndex((item) => item.id === action.payload.id);

      if (existingIndex > -1) {
        return state.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE': {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (!existingItem) {
        return state;
      }

      if (existingItem.quantity > 1) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item,
        );
      }

      return state.filter((item) => item.id !== action.payload.id);
    }

    case 'CLEAR': {
      return [];
    }

    default:
      return state;
  }
}

export default cartReducer;
