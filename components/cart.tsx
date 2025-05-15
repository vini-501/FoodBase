"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, QrCode, Banknote, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { placeOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

export function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const deliveryCharges = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + tax + deliveryCharges;

  useEffect(() => {
    // Load cart from localStorage on component mount
    const loadCart = () => {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Convert numeric IDs to menu-{id} format if they're not already in that format
        const formattedCart = parsedCart.map((item: any) => ({
          ...item,
          id: typeof item.id === "number" ? `menu-${item.id}` : item.id,
        }));
        setCartItems(formattedCart);
      }
    };

    loadCart();

    // Listen for cart updates from other components
    window.addEventListener("cart-updated", loadCart);

    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  const removeItem = (id: string | number) => {
    const itemId = typeof id === "number" ? `menu-${id}` : id;
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    toast.success("Item has been removed from your cart.", { duration: 2000 });
  };

  const updateQuantity = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const itemId = typeof id === "number" ? `menu-${id}` : id;

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast(
        "Cart is empty. Please add items to your cart before placing an order.",
        { icon: "⚠️" }
      );
      return;
    }

    if (!deliveryAddress) {
      toast.error(
        "Delivery address required. Please enter a delivery address."
      );
      return;
    }

    if (!paymentMethod) {
      toast.error("Payment method required. Please select a payment method.");
      return;
    }

    setLoading(true);

    try {
      // Get user from session or localStorage
      const userSession =
        localStorage.getItem("user_session") ||
        sessionStorage.getItem("user_session");
      if (!userSession) {
        toast.error("Please login to place an order");
        router.push("/login");
        return;
      }

      const user = JSON.parse(userSession);
      if (!user.id) {
        toast.error("Invalid user session. Please login again.");
        router.push("/login");
        return;
      }

      // Prepare order data
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          ...item,
          id: item.id.toString(), // Convert numeric ID to string
        })),
        subtotal,
        tax,
        total,
        deliveryAddress,
        restaurantName: "South Indian Delights",
        deliveryCharges,
        paymentMethod,
      };

      // Place order
      const result = await placeOrder({
        ...orderData,
        totalAmount: total,
        status: "pending",
        deliveryAddress: deliveryAddress,
      });

      if (result.success) {
        console.log("Order placed successfully:", result);

        // Clear cart
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setDeliveryAddress("");
        setPaymentMethod("");

        // Save order to localStorage for demonstration purposes
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        savedOrders.push({
          ...orderData,
          id: result.orderId,
          date: new Date().toISOString(),
        });
        localStorage.setItem("orders", JSON.stringify(savedOrders));

        // Show success message
        toast.success(
          `Thank you for your order! Your order #${result.orderId} has been placed and will be delivered soon.`,
          { duration: 8000 }
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          toast.error("Your session has expired. Please login again.");
          router.push("/login");
        } else {
          toast.error(
            error.message ||
              "There was an error processing your order. Please try again."
          );
        }
      } else {
        toast.error(
          "There was an error processing your order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-2">Your Cart</h2>
        <Input
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="mb-2"
        />
      </div>
      <div className="flex-1 overflow-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty. Add some delicious South Indian dishes!
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 mb-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-green-600 font-bold">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax 5%</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Charges</span>
            <span>₹{deliveryCharges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            type="button"
            className={`flex flex-col items-center justify-center py-4 h-20 text-base rounded-lg transition-all ${
              paymentMethod === "Cash"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-green-50"
            }`}
            aria-pressed={paymentMethod === "Cash"}
            onClick={() => setPaymentMethod("Cash")}
          >
            <Banknote className="h-7 w-7 mb-2" />
            <span className="text-sm font-semibold">Cash</span>
          </Button>
          <Button
            type="button"
            className={`flex flex-col items-center justify-center py-4 h-20 text-base rounded-lg transition-all ${
              paymentMethod === "Card"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-green-50"
            }`}
            aria-pressed={paymentMethod === "Card"}
            onClick={() => setPaymentMethod("Card")}
          >
            <CreditCard className="h-7 w-7 mb-2" />
            <span className="text-sm font-semibold">Card</span>
          </Button>
          <Button
            type="button"
            className={`flex flex-col items-center justify-center py-4 h-20 text-base rounded-lg transition-all ${
              paymentMethod === "QR"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-green-50"
            }`}
            aria-pressed={paymentMethod === "QR"}
            onClick={() => setPaymentMethod("QR")}
          >
            <QrCode className="h-7 w-7 mb-2" />
            <span className="text-sm font-semibold">QR Code</span>
          </Button>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
