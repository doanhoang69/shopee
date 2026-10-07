import type { CartItem } from "@/services/cartApi";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  items: CartItem[];
}

const initialState: CheckoutState = {
  items: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setCheckoutItems } = checkoutSlice.actions;
export default checkoutSlice.reducer;
