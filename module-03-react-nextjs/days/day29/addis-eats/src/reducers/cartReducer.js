/**
 * Cart Reducer for managing shopping cart state
 * Actions supported:
 * - ADD: Adds item to cart or increments quantity
 * - REMOVE: Decrements item quantity or removes item if quantity reaches 0
 * - CLEAR: Resets cart to empty array
 */

export const INITIAL_CART_STATE = [];

export function cartReducer(state = INITIAL_CART_STATE, action) {
  switch (action.type) {
    case 'ADD': {
      const existingIndex = state.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE': {
      const existingItem = state.find(item => item.id === action.payload.id);
      if (!existingItem) return state;

      if (existingItem.quantity > 1) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return state.filter(item => item.id !== action.payload.id);
    }

    case 'CLEAR': {
      return [];
    }

    default:
      return state;
  }
}

/**
 * Exercise 3 Requirement: Call cartReducer directly with plain objects to check each case.
 */
export function runCartReducerTests() {
  console.group('--- Exercise 3: Testing cartReducer directly with plain objects ---');
  
  // Initial state
  let state = INITIAL_CART_STATE;
  console.log('Initial State:', state);

  // Test Case 1: ADD item 1 (Doro Wat)
  const addAction1 = { type: 'ADD', payload: { id: 1, name: 'Doro Wat', price: 250 } };
  state = cartReducer(state, addAction1);
  console.log('After ADD item 1:', state);
  console.assert(state.length === 1 && state[0].quantity === 1, 'Test ADD 1 failed');

  // Test Case 2: ADD item 1 again (increment quantity)
  state = cartReducer(state, addAction1);
  console.log('After ADD item 1 again (increment):', state);
  console.assert(state[0].quantity === 2, 'Test ADD increment failed');

  // Test Case 3: ADD item 2 (Shiro Tegabeno)
  const addAction2 = { type: 'ADD', payload: { id: 2, name: 'Shiro Tegabeno', price: 150 } };
  state = cartReducer(state, addAction2);
  console.log('After ADD item 2:', state);
  console.assert(state.length === 2, 'Test ADD 2 failed');

  // Test Case 4: REMOVE item 1 (decrement quantity)
  const removeAction1 = { type: 'REMOVE', payload: { id: 1 } };
  state = cartReducer(state, removeAction1);
  console.log('After REMOVE item 1 (decrement):', state);
  console.assert(state.find(i => i.id === 1).quantity === 1, 'Test REMOVE decrement failed');

  // Test Case 5: REMOVE item 1 again (remove from cart)
  state = cartReducer(state, removeAction1);
  console.log('After REMOVE item 1 again (item removed):', state);
  console.assert(!state.find(i => i.id === 1), 'Test REMOVE item failed');

  // Test Case 6: CLEAR cart
  const clearAction = { type: 'CLEAR' };
  state = cartReducer(state, clearAction);
  console.log('After CLEAR:', state);
  console.assert(state.length === 0, 'Test CLEAR failed');

  console.groupEnd();
  return true;
}

// Auto-run tests when file is imported to output verification in console
runCartReducerTests();

export default cartReducer;
