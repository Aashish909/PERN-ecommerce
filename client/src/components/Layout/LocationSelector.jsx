import { MapPin, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../../store/slices/locationSlice";

const LocationSelector = () => {
    const dispatch = useDispatch();
    const { address, loading } = useSelector((state) => state.location);

    const handleUpdateLocation = () => {
        dispatch(fetchLocation());
    };

    return (
        <div className="flex flex-col justify-center ml-2 cursor-pointer hover:bg-white/10 p-1 rounded transition-colors group" onClick={handleUpdateLocation}>
            <div className="text-[12px] text-gray-500 leading-none ml-4">
                {address ? `Delivering to ${address.city}` : "Delivering to Delhi, 110001"}
            </div>
            <div className="flex items-center gap-1 font-bold text-sm leading-none">
                <MapPin size={14} className="text-red" />
                <span className="truncate max-w-[150px]">
                    {loading ? (
                        <span className="flex items-center gap-1">
                            <RefreshCw size={12} className="animate-spin" /> Fetching...
                        </span>
                    ) : address ? (
                        `${address.pincode}`
                    ) : (
                        "Update location"
                    )}
                </span>
            </div>
        </div>
    );
};

export default LocationSelector;
