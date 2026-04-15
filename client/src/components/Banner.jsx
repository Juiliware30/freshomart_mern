import { Link } from "react-router-dom";
import { FiArrowRight } from 'react-icons/fi';

const Banner = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl mt-10">
      {/* Background Image */}
      <img
        src="/image3.png"
        alt="Fresh Groceries Banner"
        className="w-full h-[400px] md:h-[480px] object-cover"
      />

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col items-center md:items-start justify-center px-8 md:px-20 text-white">

        <h1 className="text-4xl md:text-6xl font-black text-center md:text-left max-w-xl leading-tight md:leading-[1.1]">
          Freshness You Can <span className="text-emerald-400">Trust</span>, Savings You will <span className="text-emerald-400">Love!</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center mt-10 gap-4 w-full sm:w-auto">
          <Link
            to="/products"
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/30 w-full sm:w-auto overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now <FiArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/products"
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold transition-all w-full sm:w-auto"
          >
            Explore Deals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
