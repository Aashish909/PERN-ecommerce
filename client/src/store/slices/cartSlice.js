import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i.id === item.id);

      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i.id === isItemExist.id ? { ...item, quantity: i.quantity + item.quantity } : i
        );
      } else {
        state.cart.push(item);
      }
      saveCartToStorage(state.cart);
      toast.success("Item added to cart");
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.cart);
      toast.success("Item removed from cart");
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cart.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
        saveCartToStorage(state.cart);
      }
    },
    saveShippingInfo(state, action) {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
    clearCart(state) {
      state.cart = [];
      saveCartToStorage([]);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
