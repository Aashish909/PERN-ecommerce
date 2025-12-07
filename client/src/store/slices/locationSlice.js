import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Thunk to fetch location from coordinates using OpenStreetMap (Nominatim)
export const fetchLocation = createAsyncThunk(
    "location/fetchLocation",
    async (_, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                toast.error("Geolocation is not supported by your browser");
                return reject(rejectWithValue("Geolocation not supported"));
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        // Using OpenStreetMap Nominatim API (Free, no key required for low usage)
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        if (data.address) {
                            const address = {
                                city: data.address.city || data.address.town || data.address.village || "",
                                state: data.address.state || "",
                                country: data.address.country || "",
                                pincode: data.address.postcode || "",
                                fullAddress: data.display_name || "",
                            };
                            toast.success("Location updated successfully");
                            resolve(address);
                        } else {
                            toast.error("Could not determine address");
                            reject(rejectWithValue("Could not determine address"));
                        }
                    } catch (error) {
                        toast.error("Failed to fetch address details");
                        reject(rejectWithValue(error.message));
                    }
                },
                (error) => {
                    toast.error("Unable to retrieve your location");
                    reject(rejectWithValue(error.message));
                }
            );
        });
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState: {
        address: null,
        loading: false,
        error: null,
    },
    reducers: {
        setLocation: (state, action) => {
            state.address = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.address = action.payload;
            })
            .addCase(fetchLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
