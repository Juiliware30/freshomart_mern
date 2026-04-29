import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Address = () => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const { axios, user, navigate } = useContext(AppContext);
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHanlder = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/address/add", { address });
      console.log("data", data);
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);
  return (
    <div className="mt-10 flex flex-col md:flex-row gap-6 p-2 rounded-lg">
      {/* Left Side: Video */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <video
            src="/Location review.mp4"
            className="w-full rounded-2xl"
            autoPlay
            loop
            muted
          ></video>
          <p className="text-center text-gray-500 mt-4 font-medium">
            Review your location details
          </p>
        </div>
      </div>

      {/* Right Side: Address Fields */}
      <div className="flex-1 p-2 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Address Details
        </h2>
        <form
          onSubmit={submitHanlder}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          <div>
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Street</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Zip Code</label>
            <input
              type="number"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Country</label>
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Phone</label>
            <input
              type="number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className="w-full p-1.5 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 rounded-md"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;
