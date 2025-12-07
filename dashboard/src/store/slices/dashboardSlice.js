import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
    "dashboard/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/fetch/dashboard-stats");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch dashboard stats"
            );
        }
    }
);

// Async thunk to fetch recent orders
export const fetchRecentOrders = createAsyncThunk(
    "dashboard/fetchRecentOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/fetch/recent-orders");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch recent orders"
            );
        }
    }
);

// Async thunk to fetch stock out products
export const fetchStockOutProducts = createAsyncThunk(
    "dashboard/fetchStockOutProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/fetch/stock-out-products");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stock out products"
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        loading: false,
        error: null,

        // Dashboard Stats
        totalRevenueAllTime: 0,
        todayRevenue: 0,
        yesterdayRevenue: 0,
        totalUsersCount: 0,
        orderStatusCounts: {
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0,
        },
        monthlySales: [],
        currentMonthSales: 0,
        topSellingProducts: [],
        lowStockProducts: [],
        revenueGrowth: "",
        newUsersThisMonth: 0,

        // Recent Orders
        recentOrders: [],

        // Stock Out Products
        stockOutProducts: [],
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Dashboard Stats
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.totalRevenueAllTime = action.payload.totalRevenueAllTime;
                state.todayRevenue = action.payload.todayRevenue;
                state.yesterdayRevenue = action.payload.yesterdayRevenue;
                state.totalUsersCount = action.payload.totalUsersCount;
                state.orderStatusCounts = action.payload.orderStatusCounts;
                state.monthlySales = action.payload.monthlySales;
                state.currentMonthSales = action.payload.currentMonthSales;
                state.topSellingProducts = action.payload.topSellingProducts;
                state.lowStockProducts = action.payload.lowStockProducts;
                state.revenueGrowth = action.payload.revenueGrowth;
                state.newUsersThisMonth = action.payload.newUsersThisMonth;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Recent Orders
        builder
            .addCase(fetchRecentOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.recentOrders = action.payload.orders;
            })
            .addCase(fetchRecentOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Stock Out Products
        builder
            .addCase(fetchStockOutProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockOutProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.stockOutProducts = action.payload.products;
            })
            .addCase(fetchStockOutProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
