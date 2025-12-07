import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../store/slices/locationSlice";
import { MapPin, Save, Home, Briefcase, Map } from "lucide-react";
import { toast } from "react-toastify";

const Address = () => {
    const dispatch = useDispatch();
    const { address: fetchedAddress, loading } = useSelector((state) => state.location);

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        landmark: "",
        alternatePhone: "",
        addressType: "Home",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUseCurrentLocation = () => {
        dispatch(fetchLocation()).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const addr = result.payload;
                setFormData((prev) => ({
                    ...prev,
                    pincode: addr.pincode,
                    city: addr.city,
                    state: addr.state,
                    locality: addr.fullAddress.split(",")[0] || "",
                    address: addr.fullAddress,
                }));
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically dispatch an action to save the address to the backend
        console.log("Address Data:", formData);
        toast.success("Address saved successfully!");
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>

                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-primary">Add New Address</h2>
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            <MapPin size={16} />
                            {loading ? "Fetching..." : "Use my current location"}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Locality</label>
                                <input
                                    type="text"
                                    name="locality"
                                    value={formData.locality}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address (Area and Street)</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City/District/Town</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alternate Phone (Optional)</label>
                                <input
                                    type="tel"
                                    name="alternatePhone"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address Type</label>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.addressType === 'Home' ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:bg-accent'}`}>
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value="Home"
                                        checked={formData.addressType === "Home"}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <Home size={16} />
                                    Home
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.addressType === 'Work' ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:bg-accent'}`}>
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value="Work"
                                        checked={formData.addressType === "Work"}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <Briefcase size={16} />
                                    Work
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save Address
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl border border-input font-semibold hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Address;
