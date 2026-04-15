import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const ProductList = () => {
  const { products, fetchProducts, axios, categories } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFiles, setEditFiles] = useState([]);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOfferPrice, setEditOfferPrice] = useState("");
  const [editGstEnabled, setEditGstEnabled] = useState(false);
  const [editGstPercentage, setEditGstPercentage] = useState(0);
  const [editGstType, setEditGstType] = useState("percentage");

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await axios.post("/api/product/remove", { id });
        if (data.success) {
          fetchProducts();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditCategory(product.category);
    setEditPrice(product.price);
    setEditOfferPrice(product.offerPrice);
    setEditGstEnabled(product.gstEnabled || false);
    setEditGstPercentage(product.gstPercentage || 0);
    setEditGstType(product.gstType || "percentage");
    setEditFiles([]); // Reset files, will keep existing images if no new ones are selected
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", editingProduct._id);
      formData.append("name", editName);
      formData.append("description", editDescription);
      formData.append("category", editCategory);
      formData.append("price", editPrice);
      formData.append("offerPrice", editOfferPrice);
      formData.append("inStock", editingProduct.inStock);
      formData.append("gstEnabled", editGstEnabled);
      formData.append("gstPercentage", editGstPercentage);
      formData.append("gstType", editGstType);

      formData.append("existingImages", JSON.stringify(editingProduct.image));

      editFiles.forEach((file, index) => {
        if (file) {
          formData.append("image", file);
          formData.append("imagePositions", index);
        }
      });

      const { data } = await axios.post("/api/product/update", formData);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setIsEditModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate text-center">In Stock</th>
                <th className="px-4 py-3 font-semibold truncate text-center">GST</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img
                        src={`http://localhost:5000/images/${product.image[0]}`}
                        alt="Product"
                        className="w-16"
                      />
                    </div>
                    <span className="truncate max-sm:hidden w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    ₹{product.offerPrice}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onClick={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.gstEnabled ? (
                      <span className="text-gray-900 font-medium whitespace-nowrap">
                        {product.gstPercentage}{product.gstType === "fixed" ? "₹" : "%"}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-600"
                        title="Edit Product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-600"
                        title="Delete Product"
                      >
                        <img src={assets.remove_icon} alt="Delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Product Images (Leave empty to keep existing)</p>
                <div className="flex flex-wrap gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <label key={index} className="relative cursor-pointer group">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const newFiles = [...editFiles];
                          newFiles[index] = e.target.files[0];
                          setEditFiles(newFiles);
                        }}
                      />
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center group-hover:border-blue-500 overflow-hidden bg-gray-50">
                        {editFiles[index] ? (
                          <img src={URL.createObjectURL(editFiles[index])} alt="preview" className="w-full h-full object-cover" />
                        ) : editingProduct.image && editingProduct.image[index] ? (
                          <img src={`http://localhost:5000/images/${editingProduct.image[index]}`} alt="existing" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <img src={assets.upload_area} alt="upload" className="w-8 mx-auto opacity-50" />
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-2 border rounded outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="p-2 border rounded outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="p-2 border rounded outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="p-2 border rounded outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={editOfferPrice}
                    onChange={(e) => setEditOfferPrice(e.target.value)}
                    className="p-2 border rounded outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-gstEnabled"
                    checked={editGstEnabled}
                    onChange={(e) => setEditGstEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-base font-medium" htmlFor="edit-gstEnabled">
                    Enable GST
                  </label>
                </div>
                {editGstEnabled && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="editGstType"
                          value="percentage"
                          checked={editGstType === "percentage"}
                          onChange={(e) => setEditGstType(e.target.value)}
                        />
                        <span className="text-sm text-gray-700">Percentage (%)</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="editGstType"
                          value="fixed"
                          checked={editGstType === "fixed"}
                          onChange={(e) => setEditGstType(e.target.value)}
                        />
                        <span className="text-sm text-gray-700">Fixed (₹)</span>
                      </label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600" htmlFor="edit-gstPercentage">
                        GST {editGstType === "percentage" ? "Percentage (%)" : "Amount (₹)"}
                      </label>
                      <input
                        id="edit-gstPercentage"
                        type="number"
                        value={editGstPercentage}
                        onChange={(e) => setEditGstPercentage(e.target.value)}
                        placeholder={editGstType === "percentage" ? "18" : "10"}
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 w-32"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
