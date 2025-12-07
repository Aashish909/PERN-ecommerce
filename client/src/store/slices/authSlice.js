import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    toast.success(response.data.message);
    dispatch(toggleAuthPopup());
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || "Registration failed");
    return rejectWithValue(error.response.data.message);
  }
});

export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    toast.success(response.data.message);
    dispatch(toggleAuthPopup());
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || "Login failed");
    return rejectWithValue(error.response.data.message);
  }
});

export const getUser = createAsyncThunk("auth/getUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.response.data.message || "Failed to get user");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.get("/auth/logout");
    toast.success("Logout successful");
    return null;
  } catch (error) {
    toast.error(error.response.data.message || "Logout failed");
    return rejectWithValue(error.response.data.message);
  }
});

export const forgotPassword = createAsyncThunk("/auth/forgot/password", async (email, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/password/forgot?frontendUrl=http://localhost:5173", email);
    toast.success(response.data.message);
    return null;
  } catch (error) {
    toast.error(error.response.data.message || "Forgot password failed");
    return rejectWithValue(error.response.data.message);
  }
})

export const resetPassword = createAsyncThunk("auth/password/reset", async ({ token, password, confirmPassword }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/auth/password/reset/${token}`, { password, confirmPassword });
    toast.success(response.data.message || "Password reset successfully");
    return response.data.user;
  } catch (error) {
    toast.error(error.response.data.message || "Password reset failed");
    return rejectWithValue(error.response.data.message);
  }
})

export const updatePassword = createAsyncThunk("auth/password/update", async (passwordData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/auth/password/update", passwordData);
    toast.success(response.data.message || "Password updated successfully");
    return response.data.user;
  } catch (error) {
    toast.error(error.response.data.message || "Password update failed");
    return rejectWithValue(error.response.data.message);
  }
});

export const updateProfile = createAsyncThunk("auth/me/update", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/auth/profile/update", userData);
    toast.success("Profile updated successfully");
    return response.data.user;
  } catch (error) {
    toast.error(error.response.data.message || "Profile update failed");
    return rejectWithValue(error.response.data);
  }
});



const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isCheckingAuth: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isSigningUp = false;
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      //getUser
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = state.authUser;
      })
      //forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingforToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isRequestingforToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingforToken = false;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isResettingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isResettingPassword = false;
        // Do not set authUser here, force user to login with new password
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isResettingPassword = false;
      })
      //Update password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.authUser = action.payload.user;
        state.isUpdatingProfile = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
  },
});

export default authSlice.reducer;
