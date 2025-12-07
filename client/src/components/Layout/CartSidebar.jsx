import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleCart } from "../../store/slices/popupSlice";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out animate-slide-in-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h2 className="text-lg font-semibold">Shopping Cart ({cart.length})</h2>
            </div>
            <button
              onClick={() => dispatch(toggleCart())}
              className="rounded-full p-2 hover:bg-accent hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag size={64} className="mb-4 text-muted-foreground/20" />
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground">
                  Looks like you haven't added anything yet.
                </p>
                <button
                  onClick={() => dispatch(toggleCart())}
                  className="mt-4 text-primary hover:underline"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={
                          Array.isArray(item.images) && item.images.length > 0
                            ? (item.images[0]?.url || item.images[0])
                            : "https://placehold.co/100"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ${item.price}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              )
                            }
                            className="p-1 hover:text-primary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-xs font-medium">
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
                            className="p-1 hover:text-primary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="grid gap-2">
                <Link
                  to="/cart"
                  onClick={() => dispatch(toggleCart())}
                  className="flex w-full items-center justify-center rounded-lg border border-primary bg-transparent py-3 font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/payment"
                  onClick={() => dispatch(toggleCart())}
                  className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
