import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 2; // Backend logic: free shipping over $50, else $2
  const tax = subtotal * 0.18; // Backend uses 18% tax
  const total = Math.round(subtotal + subtotal * 0.18 + shipping);

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background pt-48 lg:pt-52">
        <ShoppingBag size={64} className="mb-4 text-muted-foreground/20" />
        <h2 className="mb-2 text-2xl font-bold">Your Cart is Empty</h2>
        <p className="mb-8 text-muted-foreground">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/products"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-48 lg:pt-52 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-accent hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={
                      Array.isArray(item.images) && item.images.length > 0
                        ? (item.images[0]?.url || item.images[0])
                        : "https://placehold.co/150"
                    }
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="mt-1 font-bold text-primary">${item.price}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-1">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          )
                        }
                        className="p-2 hover:text-primary"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.min(item.stock, item.quantity + 1),
                            })
                          )
                        }
                        className="p-2 hover:text-primary"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="w-20 text-right font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 text-sm text-destructive hover:underline"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (18%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  (Includes ${tax.toFixed(2)} tax)
                </p>
              </div>

              <Link
                to="/payment"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 py-3.5 font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                className="flex w-full items-center justify-center rounded-lg border border-border bg-transparent py-3 font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
