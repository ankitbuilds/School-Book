import axios from "axios";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookContext } from "../../context/School.jsx";
import CartItem from "../../components/frontend/CartItem.jsx";

function FCart() {
    const {
        user,
        cartItems,
        setCartItems,
        setToastConfig,
        setShowToast,
    } = useContext(BookContext);

    const navigate = useNavigate();

    // ==========================================
    // Make sure cartItems is always an array
    // ==========================================
    const safeCartItems = Array.isArray(cartItems)
        ? cartItems
        : Array.isArray(cartItems?.items)
        ? cartItems.items
        : Array.isArray(cartItems?.data)
        ? cartItems.data
        : [];

    // ==========================================
    // Calculate cart totals
    // ==========================================
    const { totalItems, totalAmount } = useMemo(() => {
        return safeCartItems.reduce(
            (acc, item) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.book?.price) || 0;

                acc.totalItems += quantity;
                acc.totalAmount += quantity * price;

                return acc;
            },
            {
                totalItems: 0,
                totalAmount: 0,
            }
        );
    }, [safeCartItems]);

    // ==========================================
    // Get authentication token
    // ==========================================
    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ==========================================
    // Update quantity using + / -
    // ==========================================
    const updateQuantity = async (bookId, delta) => {
        if (!user) return;

        const item = safeCartItems.find(
            (i) => String(i.bookId) === String(bookId)
        );

        if (!item) return;

        // Don't allow quantity below 1
        if (delta === -1 && item.quantity <= 1) {
            return;
        }

        // Don't allow quantity above stock
        if (
            delta === 1 &&
            item.book?.stockQty !== undefined &&
            item.quantity >= item.book.stockQty
        ) {
            return;
        }

        // ==========================================
        // Optimistic UI update
        // ==========================================
        setCartItems((prev) => {
            const items = Array.isArray(prev)
                ? prev
                : Array.isArray(prev?.items)
                ? prev.items
                : [];

            return items.map((i) =>
                String(i.bookId) === String(bookId)
                    ? {
                          ...i,
                          quantity: i.quantity + delta,
                      }
                    : i
            );
        });

        try {
            const token = getToken();

            await axios.post(
                `${import.meta.env.VITE_API}/api/cart`,
                {
                    userId: user.id,
                    bookId,
                    quantity: delta,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error(
                "Quantity update failed:",
                error.response?.data || error.message
            );

            // ==========================================
            // Rollback UI if API fails
            // ==========================================
            setCartItems((prev) => {
                const items = Array.isArray(prev)
                    ? prev
                    : Array.isArray(prev?.items)
                    ? prev.items
                    : [];

                return items.map((i) =>
                    String(i.bookId) === String(bookId)
                        ? {
                              ...i,
                              quantity: i.quantity - delta,
                          }
                        : i
                );
            });

            setToastConfig({
                type: "error",
                title: "Action failed",
                message:
                    "Unable to update quantity. Please try again.",
            });

            setShowToast(true);
        }
    };

    // ==========================================
    // Update quantity using input
    // ==========================================
    const updateQuantityByInput = async (bookId, value) => {
        if (!user) return;

        const item = safeCartItems.find(
            (i) => String(i.bookId) === String(bookId)
        );

        if (!item) return;

        let newQty = Number(value);

        if (Number.isNaN(newQty)) {
            return;
        }

        const stockQty = Number(item.book?.stockQty);

        // ==========================================
        // Validate quantity
        // ==========================================
        newQty = Math.max(1, newQty);

        if (!Number.isNaN(stockQty) && stockQty > 0) {
            newQty = Math.min(newQty, stockQty);
        }

        const delta = newQty - item.quantity;

        if (delta === 0) {
            return;
        }

        // ==========================================
        // Optimistic UI update
        // ==========================================
        setCartItems((prev) => {
            const items = Array.isArray(prev)
                ? prev
                : Array.isArray(prev?.items)
                ? prev.items
                : [];

            return items.map((i) =>
                String(i.bookId) === String(bookId)
                    ? {
                          ...i,
                          quantity: newQty,
                      }
                    : i
            );
        });

        try {
            const token = getToken();

            await axios.post(
                `${import.meta.env.VITE_API}/api/cart`,
                {
                    userId: user.id,
                    bookId,
                    quantity: delta,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error(
                "Quantity input update failed:",
                error.response?.data || error.message
            );

            // ==========================================
            // Rollback UI
            // ==========================================
            setCartItems((prev) => {
                const items = Array.isArray(prev)
                    ? prev
                    : Array.isArray(prev?.items)
                    ? prev.items
                    : [];

                return items.map((i) =>
                    String(i.bookId) === String(bookId)
                        ? {
                              ...i,
                              quantity: item.quantity,
                          }
                        : i
                );
            });

            setToastConfig({
                type: "error",
                title: "Action failed",
                message:
                    "Unable to update quantity. Please try again.",
            });

            setShowToast(true);
        }
    };

    // ==========================================
    // Remove item from cart
    // ==========================================
    const removeItemFromCart = async (bookId) => {
        if (!user) return;

        const item = safeCartItems.find(
            (i) => String(i.bookId) === String(bookId)
        );

        if (!item) return;

        // ==========================================
        // Optimistically remove from UI
        // ==========================================
        setCartItems((prev) => {
            const items = Array.isArray(prev)
                ? prev
                : Array.isArray(prev?.items)
                ? prev.items
                : [];

            return items.filter(
                (i) => String(i.bookId) !== String(bookId)
            );
        });

        try {
            const token = getToken();

            // ==========================================
            // Remove by decreasing quantity
            // ==========================================
            await axios.post(
                `${import.meta.env.VITE_API}/api/cart`,
                {
                    userId: user.id,
                    bookId,
                    quantity: -item.quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setToastConfig({
                type: "info",
                title: "Removed from cart",
                message:
                    "The product has been removed from your cart.",
            });
        } catch (error) {
            console.error(
                "Remove item failed:",
                error.response?.data || error.message
            );

            // ==========================================
            // Restore item if API request fails
            // ==========================================
            setCartItems((prev) => {
                const items = Array.isArray(prev)
                    ? prev
                    : Array.isArray(prev?.items)
                    ? prev.items
                    : [];

                const alreadyExists = items.some(
                    (i) =>
                        String(i.bookId) === String(bookId)
                );

                if (alreadyExists) {
                    return items;
                }

                return [...items, item];
            });

            setToastConfig({
                type: "error",
                title: "Action failed",
                message:
                    "Unable to remove the item. Please try again.",
            });
        } finally {
            setShowToast(true);
        }
    };

    // ==========================================
    // Checkout
    // ==========================================
    const handleCheckout = () => {
        navigate("/checkout");
    };

    // ==========================================
    // Empty cart
    // ==========================================
    if (safeCartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    🛒 Your cart is empty
                </p>
            </div>
        );
    }

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    My Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ==============================
                        Cart Items
                    ============================== */}
                    <div className="lg:col-span-2 space-y-4">

                        {safeCartItems.map((item) => (
                            <CartItem
                                key={String(item.bookId)}
                                item={item}
                                updateQuantityByInput={
                                    updateQuantityByInput
                                }
                                updateQuantity={updateQuantity}
                                removeItemFromCart={
                                    removeItemFromCart
                                }
                            />
                        ))}

                    </div>

                    {/* ==============================
                        Order Summary
                    ============================== */}
                    <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-5 h-fit">

                        <h2 className="text-lg font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="flex justify-between text-sm mb-2">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <span>Total Amount</span>

                            <span className="font-semibold">
                                ₹{totalAmount}
                            </span>
                        </div>

                        <button
                            className="w-full bg-blue-900 hover:bg-blue-950 text-white py-2 rounded-lg font-medium transition"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default FCart;