import { assets } from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const AddProduct = () => {
  const { axios, categories } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [gstType, setGstType] = useState("percentage");


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("gstEnabled", gstEnabled);
      formData.append("gstPercentage", gstPercentage);
      formData.append("gstType", gstType);

      for (let i = 0; i < files.length; i++) {
        formData.append("image", files[i]);
      }

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setGstEnabled(false);
        setGstPercentage(0);
        setGstType("percentage");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option value={item.name} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gstEnabled"
              checked={gstEnabled}
              onChange={(e) => setGstEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-base font-medium" htmlFor="gstEnabled">
              Enable GST
            </label>
          </div>
          {gstEnabled && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gstType"
                    value="percentage"
                    checked={gstType === "percentage"}
                    onChange={(e) => setGstType(e.target.value)}
                  />
                  <span className="text-sm text-gray-700">Percentage (%)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gstType"
                    value="fixed"
                    checked={gstType === "fixed"}
                    onChange={(e) => setGstType(e.target.value)}
                  />
                  <span className="text-sm text-gray-700">Fixed (₹)</span>
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600" htmlFor="gstPercentage">
                  GST {gstType === "percentage" ? "Percentage (%)" : "Amount (₹)"}
                </label>
                <input
                  id="gstPercentage"
                  type="number"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(e.target.value)}
                  placeholder={gstType === "percentage" ? "18" : "10"}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40 w-32"
                />
              </div>
            </div>
          )}
        </div>
        <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          ADD
        </button>
      </form>
    </div>
  );
};
export default AddProduct;
