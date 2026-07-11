import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../services';

export interface CartItem {
  id: string; // unique item id inside the cart
  roomId: string;
  checkIn: string;
  checkOut: string;
  days: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
}

const CART_KEY = 'vh_v1_cart';

const initialState: CartState = {
  items: StorageService.get<CartItem[]>(CART_KEY) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'id'>>) {
      const newItem: CartItem = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.items.push(newItem);
      StorageService.set(CART_KEY, state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      StorageService.set(CART_KEY, state.items);
    },
    clearCart(state) {
      state.items = [];
      StorageService.remove(CART_KEY);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
