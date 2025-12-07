import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/slices/authSlice";
import { toggleAuthPopup } from "../store/slices/popupSlice";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isResettingPassword } = useSelector((state) => state.auth);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 4 || password.length > 16) {
            toast.error("Password must be between 4 and 16 characters");
            return;
        }

        dispatch(resetPassword({ token, password, confirmPassword })).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                navigate("/");
                dispatch(toggleAuthPopup());
            }
        });
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-lg border border-border">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border-2 border-input bg-background px-12 pr-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                                minLength={4}
                                maxLength={16}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border-2 border-input bg-background px-12 pr-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                                minLength={4}
                                maxLength={16}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isResettingPassword}
                        className="w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResettingPassword ? "Resetting..." : "Reset Password"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex items-center justify-center gap-2 mx-auto text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
