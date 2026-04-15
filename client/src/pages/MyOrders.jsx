import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiTruck,
  FiCalendar,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const { axios, user } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        // Show newest orders first
        setMyOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = myOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(myOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-4">
        <FiPackage className="text-2xl text-emerald-500" />
        <h1 className="text-3xl lg:text-4xl font-medium text-gray-800 tracking-tight">My Orders</h1>
      </div>

      <div className="space-y-10">
        {myOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <FiPackage className="text-5xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No orders found yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {currentOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                        <p className="text-sm text-gray-600 font-medium">#{order._id.slice(-8)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                          <FiCalendar className="text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                        <p className="text-lg text-emerald-600 font-medium tracking-tight">₹{order.amount}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-emerald-50 text-emerald-600'
                        } flex items-center gap-2`}>
                        <FiTruck /> {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center border border-gray-100/50">
                            <img
                              src={`${backendUrl}/images/${item.product.image[0]}`}
                              alt={item.product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div>
                            <h2 className="text-lg font-medium text-gray-800 leading-tight mb-1">{item.product.name}</h2>
                            <p className="text-sm text-gray-400 mb-1">{item.product.category}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Qty: {item.quantity || 1}</span>
                              <span className="text-gray-400 font-medium italic">₹{item.product.offerPrice} / unit</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <FiCreditCard /> {order.paymentType} Payment
                          </div>
                          <p className="text-xl text-gray-700 font-medium">₹{item.product.offerPrice * (item.quantity || 1)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-100 disabled:opacity-50 disabled:hover:text-gray-400 transition-all"
                >
                  <FiChevronLeft className="text-xl" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === i + 1
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : "bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-emerald-600 hover:border-emerald-100 disabled:opacity-50 disabled:hover:text-gray-400 transition-all"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
