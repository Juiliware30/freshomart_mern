import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const Categories = () => {
    const { axios } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/api/category/list");
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !image) {
            return toast.error("Please provide both name and image");
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("image", image);

            const { data } = await axios.post("/api/category/add", formData);
            if (data.success) {
                toast.success(data.message);
                setName("");
                setImage(null);
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const { data } = await axios.post("/api/category/delete", { id });
            if (data.success) {
                toast.success(data.message);
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="p-4 md:p-10 w-full overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Manage Categories</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Add Category Form */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium mb-4">Add New Category</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                            <label htmlFor="image" className="cursor-pointer inline-block">
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                    {image ? (
                                        <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={assets.upload_area} alt="upload" className="w-12 h-12 opacity-50" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    hidden
                                    onChange={(e) => setImage(e.target.files[0])}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Category Name (e.g. Fruits, Vegetables)"
                                className="w-full outline-none py-2 px-3 rounded border border-gray-300 focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>
                        <button
                            disabled={loading}
                            className="w-full py-2.5 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 transition-colors disabled:bg-indigo-300"
                        >
                            {loading ? "Adding..." : "Add Category"}
                        </button>
                    </form>
                </div>

                {/* Categories List */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium mb-4">Existing Categories</h3>
                    <div className="space-y-3">
                        {categories.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No categories found.</p>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat._id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded object-cover" />
                                        <span className="font-medium text-gray-700">{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Category"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
