import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const placeNewOrder = createAsyncThunk(
  "order/placeNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/new", orderData);
      toast.success("Order placed successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to place order");
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/orders/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    orderDetails: {},
    isOrderPlaced: false,
  },
  reducers: {
    resetOrderPlaced(state) {
      state.isOrderPlaced = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeNewOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.isOrderPlaced = true;
        // Optionally clear cart here or in component
      })
      .addCase(placeNewOrder.rejected, (state) => {
        state.loading = false;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.myOrders;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetOrderPlaced } = orderSlice.actions;
export default orderSlice.reducer;
