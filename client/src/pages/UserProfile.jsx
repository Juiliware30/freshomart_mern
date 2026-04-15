import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiPhone,
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiSave,
  FiX,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiMail,
  FiUsers,
  FiEdit
} from 'react-icons/fi';

const UserProfile = () => {
  const { user, setUser, axios, navigate, cartCount } = useAppContext();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "",
  });
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/order/user");
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    if (user) fetchOrders();
  }, [user, axios]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
      });
      setEdited(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.name.trim())) {
      return toast.error("Name should only contain letters", {
        icon: <FiX className="text-red-500" />
      });
    }

    if (form.phone && form.phone.length > 10) {
      return toast.error("Phone number should be maximum 10 digits", {
        icon: <FiX className="text-red-500" />
      });
    }

    setSaving(true);
    try {
      const { data } = await axios.put("/api/user/profile", {
        name: form.name,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
      });
      if (data.success) {
        setUser(data.user);
        setEdited(false);
        toast.success("Profile updated successfully", {
          icon: <FiCheckCircle className="text-emerald-500" />
        });
      } else {
        toast.error(data.message || "Update failed", {
          icon: <FiX className="text-red-500" />
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update profile";
      toast.error(msg, {
        icon: <FiX className="text-red-500" />
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const initials = form.name
    ? form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const genderLabel = {
    male: "Male",
    female: "Female",
    other: "Other",
    prefer_not_to_say: "Prefer not to say",
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-5">
          <FiUser className="text-3xl text-emerald-500" />
          <h1 className="text-3xl font-medium text-gray-800 tracking-tight">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-emerald-500">
                  <FiEdit className="text-sm" />
                </div>
              </div>

              <h2 className="text-xl font-medium text-gray-800 mb-1">{form.name || "Your Name"}</h2>
              <p className="text-xs text-gray-400 mb-6 font-medium uppercase tracking-widest">{form.email}</p>

              <div className="flex justify-center gap-2 mb-8">
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Verified Account</span>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-emerald-500 transition-all group-hover:bg-emerald-50 group-hover:border-emerald-100">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone</p>
                    <p className="text-sm text-gray-600 font-medium">{form.phone || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-emerald-500 transition-all group-hover:bg-emerald-50 group-hover:border-emerald-100">
                    <FiShoppingCart />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Orders</p>
                    <p className="text-sm text-gray-600 font-medium">{orders.length} Completed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-[2rem] p-6">
              <h4 className="text-sm font-medium text-emerald-800 mb-4 flex items-center gap-2">
                <FiShield className="text-emerald-500" /> Security Check
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-700/70">
                  <span>Secure Login</span>
                  <FiCheckCircle className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-700/70">
                  <span>Private Profile</span>
                  <FiLock className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10">
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-1">Account Information</h3>
                <p className="text-sm text-gray-400">Manage your personal details and delivery settings</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        name="name"
                        value={form.name}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[0-9]/g, "");
                          setForm(prev => ({ ...prev, name: val }));
                          setEdited(true);
                        }}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-emerald-300 focus:bg-white transition-all transition-duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        value={form.email}
                        readOnly
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-50 rounded-2xl text-sm text-gray-400 cursor-not-allowed italic"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Phone No</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) {
                            setForm(prev => ({ ...prev, phone: val }));
                            setEdited(true);
                          }
                        }}
                        maxLength="10"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-emerald-300 focus:bg-white transition-all"
                        placeholder="10 Digits"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Gender</label>
                    <div className="relative">
                      <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-emerald-300 focus:bg-white appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Default Address</label>
                  <div className="relative">
                    <FiHome className="absolute left-4 top-4 text-gray-300" />
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 focus:outline-none focus:border-emerald-300 focus:bg-white transition-all resize-none"
                      placeholder="Home or work address..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving || !edited}
                    className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-100 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? "Updating..." : <><FiSave className="text-sm" /> Save Profile</>}
                  </button>

                  {edited && (
                    <button
                      type="button"
                      onClick={() => {
                        if (user) {
                          setForm({
                            name: user.name || "",
                            email: user.email || "",
                            phone: user.phone || "",
                            address: user.address || "",
                            gender: user.gender || "",
                          });
                          setEdited(false);
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Discard Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
