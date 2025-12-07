import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { placeNewOrder, resetOrderPlaced } from "../store/slices/orderSlice";
import { clearCart, saveShippingInfo } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

// Replace with  publishable key
const stripePromise = loadStripe("pk_test_51NmExlSDsvFcOzzrW7DotGQ865LbcU4XkHrzfUQk5Y9RlnVA8N2prBsLWcJxSJe1P6qeQcSs5RbjHCCRqoCPkWOV008knACzex");

const CheckoutForm = ({ shippingInfo, cartItems, subtotal, tax, shipping, total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.order);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === "card" && (!stripe || !elements)) return;

    try {
      // 1. Prepare Order Payload
      const payload = {
        full_name: shippingInfo.full_name || authUser.name,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country,
        pincode: shippingInfo.pincode || shippingInfo.pinCode || "",
        phone: shippingInfo.phone || shippingInfo.phoneNo || "",
        orderedItems: cartItems.map(item => ({
          product: {
            id: item.id,
            images: Array.isArray(item.images) ? item.images : (item.images ? [item.images] : [])
          },
          quantity: item.quantity
        })),
        paymentMethod: paymentMethod // Add payment method to payload if backend supports it
      };

      const actionResult = await dispatch(placeNewOrder(payload));

      if (placeNewOrder.rejected.match(actionResult)) {
        toast.error(actionResult.payload?.message || "Failed to place order");
        return;
      }

      // 2. Handle Payment based on Method
      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        if (onPaymentSuccess) {
          onPaymentSuccess();
        } else {
          navigate("/orders");
        }
        return;
      }

      // Card Payment Logic
      const { paymentIntent: clientSecret } = actionResult.payload || {};

      if (!clientSecret) {
        toast.error("Failed to initialize payment");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: payload.full_name,
            email: authUser.email,
            address: {
              line1: payload.address,
              city: payload.city,
              state: payload.state,
              country: payload.country,
            }
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment successful! Order placed.");
          dispatch(clearCart());
          if (onPaymentSuccess) {
            onPaymentSuccess();
          } else {
            navigate("/orders");
          }
        }
      }

    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const stripeOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937", // Hardcoded hex for text color (gray-800)
        "::placeholder": { color: "#6b7280" } // Hardcoded hex for placeholder (gray-500)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h3 className="mb-6 text-2xl font-bold flex items-center gap-3">
          <CreditCard size={24} className="text-primary" />
          Payment Methods
        </h3>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-8">
          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <span className="font-semibold">Pay with credit card</span>
          </label>

          {/* Paypal - Placeholder for now */}
          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <span className="font-semibold">Pay with Paypal</span>
          </label>

          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-primary"
            />
            <span className="font-semibold">Cash On Delivery</span>
          </label>
        </div>

        {/* Card Details - Only show if Card is selected */}
        {paymentMethod === "card" && (
          <div className="space-y-5 animate-fade-in-down">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Card Number</label>
              <div className="rounded-xl border-2 border-input bg-background p-4 focus-within:border-primary transition-colors">
                <CardNumberElement options={stripeOptions} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Exp Date</label>
                <div className="rounded-xl border-2 border-input bg-background p-4 focus-within:border-primary transition-colors">
                  <CardExpiryElement options={stripeOptions} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">CVC</label>
                <div className="rounded-xl border-2 border-input bg-background p-4 focus-within:border-primary transition-colors">
                  <CardCvcElement options={stripeOptions} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Name on Card</label>
              <input
                type="text"
                placeholder="Enter cardholder name"
                className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={(paymentMethod === 'card' && !stripe) || loading}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 py-4 font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            paymentMethod === 'cod' ? `Place Order - $${total.toFixed(2)}` : `Submit Payment - $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, shippingInfo } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const [step, setStep] = useState(2); // Start at shipping details step
  const [shippingData, setShippingData] = useState({
    full_name: shippingInfo.full_name || authUser?.name || "",
    address: shippingInfo.address || "",
    city: shippingInfo.city || "",
    state: shippingInfo.state || "",
    country: shippingInfo.country || "",
    pincode: shippingInfo.pincode || shippingInfo.pinCode || "",
    phone: shippingInfo.phone || shippingInfo.phoneNo || "",
  });

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 2; // Backend logic: free shipping over $50, else $2
  const tax = subtotal * 0.18; // Backend uses 18% tax
  const total = Math.round(subtotal + subtotal * 0.18 + shipping);

  useEffect(() => {
    if (cart.length === 0 && step < 4) { // Only redirect if cart is empty and NOT in success step
      navigate("/cart");
    }
    // If shipping info is not set, redirect to cart to fill it
    if (!shippingInfo.address && !shippingData.address) {
      // Allow user to fill shipping info here
    }
  }, [cart, navigate, shippingInfo, shippingData, step]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingData));
    setStep(3);
  };

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background pt-48 lg:pt-52 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-center">Checkout</h1>

        {/* Checkout Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${step >= 1 ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                }`}>
                1
              </div>
              <span className={`font-medium ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Cart</span>
            </div>
            <div className={`h-1 w-24 transition-all ${step >= 2 ? "bg-primary" : "bg-border"}`} />
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${step >= 2 ? "bg-primary border-primary text-white" : step >= 1 ? "border-primary text-primary" : "border-border text-muted-foreground"
                }`}>
                2
              </div>
              <span className={`font-medium ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Details</span>
            </div>
            <div className={`h-1 w-24 transition-all ${step >= 3 ? "bg-primary" : "bg-border"}`} />
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${step >= 3 ? "bg-primary border-primary text-white" : step >= 2 ? "border-primary text-primary" : "border-border text-muted-foreground"
                }`}>
                3
              </div>
              <span className={`font-medium ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>Payment</span>
            </div>
            <div className={`h-1 w-24 transition-all ${step >= 4 ? "bg-primary" : "bg-border"}`} />
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${step >= 4 ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                }`}>
                4
              </div>
              <span className={`font-medium ${step >= 4 ? "text-foreground" : "text-muted-foreground"}`}>Success</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 2 ? (
              <form onSubmit={handleShippingSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold flex items-center gap-3">
                  <Truck size={24} className="text-primary" />
                  Shipping Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={shippingData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingData.country}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Pin Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingData.pincode}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            ) : step === 3 ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  shippingInfo={shippingData}
                  cartItems={cart}
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  onPaymentSuccess={() => setStep(4)}
                />
              </Elements>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={48} />
                </div>
                <h3 className="mb-2 text-3xl font-bold">Order Placed Successfully!</h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                </p>

                <button
                  onClick={() => {
                    navigate("/orders");
                  }}
                  className="w-full max-w-sm rounded-xl bg-gradient-to-r from-primary to-blue-600 py-4 font-bold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  View My Orders
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
            <h3 className="mb-6 text-xl font-bold">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-foreground">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="text-muted-foreground">Tax (18%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-extrabold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => step > 2 ? setStep(step - 1) : navigate("/cart")}
            className="px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors font-medium"
          >
            {step > 2 ? "Back" : "Back To Cart"}
          </button>
          {step === 4 && (
            <button
              onClick={() => {
                dispatch(clearCart());
                navigate("/orders");
              }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              View Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
