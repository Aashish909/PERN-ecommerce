import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { login, register, forgotPassword } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

const LoginModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isRequestingForToken, isLoggingIn, isSigningUp } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAuthPopupOpen]);

  // Close modal when user is authenticated
  useEffect(() => {
    if (authUser && isAuthPopupOpen) {
      dispatch(toggleAuthPopup());
      if (isLogin) {
        navigate("/");
      }
    }
  }, [authUser, isAuthPopupOpen, dispatch, navigate, isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password })).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(toggleAuthPopup());
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          navigate("/");
        }
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 4 || formData.password.length > 16) {
        toast.error("Password must be between 4 and 16 characters");
        return;
      }
      dispatch(register({ name: formData.name, email: formData.email, password: formData.password })).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(toggleAuthPopup());
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          navigate("/");
        }
      });
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgotPassword({ email: formData.email })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setResetEmailSent(true);
      }
    });
  };

  if (!isAuthPopupOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 p-4"
      onClick={(e) => e.target === e.currentTarget && dispatch(toggleAuthPopup())}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl border border-border/50 animate-fade-in-up">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

        <div className="relative p-8">
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
              <Sparkles className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {isForgotPassword
                ? "Reset Password"
                : isLogin
                  ? "Welcome Back"
                  : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isForgotPassword
                ? "Enter your email to receive a reset link"
                : isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start shopping with us"}
            </p>
          </div>

          {isForgotPassword ? (
            resetEmailSent ? (
              <div className="text-center space-y-6 animate-fade-in-up">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Check your inbox</h3>
                  <p className="mt-2 text-muted-foreground">
                    We've sent a password reset link to <span className="font-medium text-foreground">{formData.email}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetEmailSent(false);
                    setIsLogin(true);
                  }}
                  className="w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-input bg-background/50 px-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-input bg-background/50 px-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    minLength={3}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-input bg-background/50 px-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-input bg-background/50 px-12 pr-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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

              {!isLogin && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-input bg-background/50 px-12 pr-12 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
              )}

              <button
                type="submit"
                disabled={isLoggingIn || isSigningUp}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoggingIn || isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                }}
                className="font-semibold text-primary hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                }}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
