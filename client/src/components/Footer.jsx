import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 items-start">
        {/* Brand Column */}
        <div className="flex-1 min-w-[250px]">
          <Link to="/" className="inline-block">
            <img src="/FreshoMart Logo.png" alt="FreshoMart Logo" className="h-16 md:h-20 w-auto object-contain -ml-2 -mt-2" />
          </Link>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Your one-stop solution for fresh groceries delivered right to your doorstep.
            We ensure quality products, fast delivery, and the best shopping experience
            for you and your family.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">QUICK LINKS</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-emerald-600 transition-colors">Products</Link></li>
            <li><Link to="/my-orders" className="hover:text-emerald-600 transition-colors">Orders</Link></li>
            <li><Link to="/cart" className="hover:text-emerald-600 transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">STAY UPDATED</h3>
          <p className="text-sm text-gray-500 mb-4">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 focus-within:border-emerald-500 transition-all">
            <input
              type="email"
              className="w-full bg-white h-10 px-4 text-sm outline-none"
              placeholder="Your email"
            />
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white h-10 px-4 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} FreshoMart. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Sitemap</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Footer;
