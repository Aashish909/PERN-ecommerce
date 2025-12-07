import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search, category, price, rating, page } = params;
      let query = "/product/?";
      if (search) query += `search=${search}&`;
      if (category && category !== "All") query += `category=${category}&`;
      if (price) query += `price=${price}&`;
      if (rating) query += `ratings=${rating}&`;
      if (page) query += `page=${page}&`;

      const response = await axiosInstance.get(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product/singleProduct/${productId}`);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAIFilteredProducts = createAsyncThunk(
  "product/fetchAIFilteredProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/product/ai-search", { userPrompt: query });
      return response.data;
    } catch (error) {
      // Handle case where backend function might be commented out
      if (error.response?.status === 404 || error.response?.status === 501) {
        toast.error("AI Search is currently unavailable. Please use regular search instead.");
        // Fallback to regular search
        const fallbackResponse = await axiosInstance.get(`/product/?search=${encodeURIComponent(query)}`);
        return fallbackResponse.data;
      } else {
        toast.error(error.response?.data?.message || "AI Search failed");
      }
      return rejectWithValue(error.response?.data || {});
    }
  }
);

export const postProductReview = createAsyncThunk(
  "product/postProductReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/product/post-new/review/${productId}`, {
        rating,
        comment,
      });
      toast.success("Review posted successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to post review");
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "product/delete/review",
  async (productId, reviewId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/product/delete/review/${productId}`);
      toast.success("Review deleted successfully");
      return reviewId;
    } catch (error) {
      // Handle case where backend function might be commented out
      if (error.response?.status === 404 || error.response?.status === 501) {
        toast.error("Review deletion is currently unavailable");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete review");
      }
      return rejectWithValue(error.response?.data || {});
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        // Backend returns newProducts and topRatedProducts separately
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })
      // Fetch Single Product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state) => {
        state.loading = false;
      })

      .addCase(postProductReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        // Update product details with new review if backend returns it
        // if (action.payload?.product) {
        //   state.productDetails = action.payload.product;
        // }
        state.productReviews = [action.payload, ...state.productReviews]
      })
      .addCase(postProductReview.rejected, (state) => {
        state.isPostingReview = false;
      })
      // AI Search Products
      .addCase(fetchAIFilteredProducts.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchAIFilteredProducts.fulfilled, (state, action) => {
        state.aiSearching = false;
        // Assuming API returns products array similar to fetchAllProducts
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        // You may also update other slices if needed
      })
      .addCase(fetchAIFilteredProducts.rejected, (state) => {
        state.aiSearching = false;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        // Update product details after review deletion
        // if (action.payload?.product) {
        //   state.productDetails = action.payload.product;
        // }
        state.productReviews = state.productReviews.filter(review => review._id !== action.payload)
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      });
  },
});

export default productSlice.reducer;
