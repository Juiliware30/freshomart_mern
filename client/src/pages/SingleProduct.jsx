import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { FiShoppingCart, FiZap, FiChevronRight, FiCheck } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const product = products.find((product) => product._id === id);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (products.length > 0 && product) {
      const filtered = products.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
    window.scrollTo(0, 0);
  }, [id, products, product]);

  useEffect(() => {
    if (product?.image && product.image.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
        <FiChevronRight className="flex-shrink-0" />
        <Link to="/products" className="hover:text-emerald-500 transition-colors">Products</Link>
        <FiChevronRight className="flex-shrink-0" />
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-emerald-500 transition-colors">
          {product.category}
        </Link>
        <FiChevronRight className="flex-shrink-0" />
        <span className="text-emerald-600 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${thumbnail === image ? "border-emerald-500 shadow-md scale-105" : "border-gray-100 opacity-70 hover:opacity-100"
                  }`}
              >
                <img
                  src={`${backendUrl}/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm aspect-square relative">
            <img
              src={`${backendUrl}/images/${thumbnail}`}
              alt={product.name}
              className="w-full h-full object-contain p-4 md:p-8"
            />
            {product.offerPrice < product.price && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 inline-block">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex text-amber-400 gap-0.5 text-lg">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating || 4) ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
              (4.0 Rating • 24 Reviews)
            </span>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">₹{product.offerPrice}</span>
              {product.offerPrice < product.price && (
                <span className="text-xl text-gray-400 line-through font-medium">₹{product.price}</span>
              )}
            </div>
            <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
              <FiCheck /> Inclusive of all taxes
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">About Product</h3>
            <ul className="space-y-3">
              {product.description.map((desc, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                  {desc}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => addToCart(product._id)}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <FiShoppingCart className="text-xl" /> Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold bg-emerald-500 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all cursor-pointer"
            >
              <FiZap className="text-xl" /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Related Products</h2>
              <p className="text-sm text-gray-400 mt-1">You might also like these from {product.category}</p>
            </div>
            <Link to="/products" className="text-sm font-bold text-emerald-500 hover:text-emerald-700 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedProducts
              .filter((p) => p.inStock)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
