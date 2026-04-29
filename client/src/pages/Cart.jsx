import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FiShoppingBag,
  FiTrash2,
  FiArrowLeft,
  FiMapPin,
  FiCreditCard,
  FiChevronRight,
  FiPlusCircle,
  FiChevronDown,
  FiTruck
} from 'react-icons/fi';

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await axios.delete(`/api/address/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        getAddress();
        if (selectedAddress?._id === id) {
          setSelectedAddress(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") {
        const total = totalCartAmount() + (totalCartAmount() * 2) / 100;
        if (total < 50) {
          return toast.error("Online payment requires a minimum order of ₹50.");
        }
        navigate("/checkout", {
          state: {
            items: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress,
          },
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const calculateGst = () => {
    let totalGst = 0;
    cartArray.forEach((product) => {
      if (product.gstEnabled) {
        if (product.gstType === "fixed") {
          totalGst += product.gstPercentage * product.quantity;
        } else {
          totalGst += (product.offerPrice * product.quantity * product.gstPercentage) / 100;
        }
      }
    });
    return Math.floor(totalGst * 100) / 100;
  };

  const totalAmount = () => {
    const baseAmount = totalCartAmount();
    const gst = calculateGst();
    return Math.round((baseAmount + gst) * 100) / 100;
  };

  if (products.length === 0) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <FiShoppingBag className="text-2xl text-emerald-500" />
            <h1 className="text-3xl font-medium text-gray-800 tracking-tight">
              Shopping Cart
              <span className="text-sm font-medium text-emerald-400 ml-3 bg-emerald-50 px-2 py-0.5 rounded-md">
                {cartCount()} Items
              </span>
            </h1>
          </div>

          <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_0.5fr] text-gray-400 text-xs uppercase tracking-widest font-bold pb-4 border-b border-gray-100">
            <p>Product Details</p>
            <p className="text-center">Quantity</p>
            <p className="text-center">Subtotal</p>
            <p className="text-right"></p>
          </div>

          <div className="divide-y divide-gray-100">
            {cartArray.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400">Your cart is empty.</p>
                <button onClick={() => navigate('/products')} className="mt-4 text-emerald-500 hover:underline">Start shopping</button>
              </div>
            ) : (
              cartArray.map((product, index) => (
                <div key={index} className="py-6 grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_0.5fr] items-center gap-6 group">
                  <div className="flex items-center gap-6">
                    <div
                      onClick={() => navigate(`/product/${product.category}/${product._id}`)}
                      className="cursor-pointer w-20 h-20 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-2xl p-2 relative overflow-hidden"
                    >
                      <img
                        className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                        src={`${backendUrl}/images/${product.image[0]}`}
                        alt={product.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-800 font-medium truncate mb-1">{product.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        {product.weight || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center bg-gray-50 rounded-xl px-2 h-10">
                      <select
                        onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                        value={cartItems[product._id]}
                        className="bg-transparent text-sm font-medium text-gray-700 outline-none w-12 text-center appearance-none"
                      >
                        {[...Array(Math.max(cartItems[product._id] || 0, 10))].map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <FiChevronDown className="text-gray-400 pointer-events-none -ml-1" />
                    </div>
                  </div>

                  <p className="text-center text-gray-700 font-medium">₹{product.offerPrice * product.quantity}</p>

                  <div className="flex justify-end pr-2">
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate("/products")}
            className="group flex items-center mt-10 gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-all"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-medium text-gray-800 border-b border-gray-50 pb-4 mb-6">Order Summary</h2>

            <div className="space-y-6">
              {/* Address Section */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Delivery Address</p>
                <div className="relative">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {selectedAddress
                        ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                        : "No address selected"}
                    </p>
                    <button
                      onClick={() => setShowAddress(!showAddress)}
                      className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:text-emerald-700 transition-colors"
                    >
                      <FiMapPin /> {selectedAddress ? "Change Address" : "Add Address"}
                    </button>
                  </div>

                  {showAddress && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {address.map((addr, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedAddress(addr);
                            setShowAddress(false);
                          }}
                          className="group flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors border-b last:border-0 border-gray-50"
                        >
                          <span className="truncate">
                            {addr.street}, {addr.city}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr._id);
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() => navigate("/add-address")}
                        className="px-4 py-3 text-sm text-emerald-500 hover:bg-emerald-50 cursor-pointer flex items-center gap-2 font-medium"
                      >
                        <FiPlusCircle /> Add new address
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentOption("COD")}
                    className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentOption === "COD"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 ring-1 ring-emerald-100"
                      : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    <FiTruck className="text-xl mb-1" />
                    <span className="text-[11px] font-medium">Cash on Delivery</span>
                  </div>

                  <div
                    onClick={() => setPaymentOption("Online")}
                    className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${paymentOption === "Online"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 ring-1 ring-emerald-100"
                      : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    <FiCreditCard className="text-xl mb-1" />
                    <span className="text-[11px] font-medium">Online Payment</span>
                  </div>
                </div>

                {paymentOption === "Online" && totalAmount() < 50 && (
                  <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1">
                    * Minimum ₹50 required for online payment
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-gray-700 font-medium">₹{totalCartAmount()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                {calculateGst() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">GST</span>
                    <span className="text-gray-700 font-medium">₹{calculateGst()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-gray-900 font-medium">Order Total</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">₹{totalAmount()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-100 hover:shadow-emerald-200 mt-4 disabled:bg-gray-200 disabled:shadow-none"
                disabled={cartArray.length === 0}
              >
                {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
