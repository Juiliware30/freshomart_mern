import { useAppContext } from "../context/AppContext";
const Category = () => {
  const { navigate, categories } = useAppContext();
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>
      <div className=" my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 items-center justify-center">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group cursor-pointer py-5 px-3 rounded-lg gap-2 flex flex-col items-center justify-center`}
            style={{ backgroundColor: category.bgColor || "#f3f4f6" }}
            onClick={() => {
              navigate(`/products/${category.name.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt=""
              className="max-w-28 transition group-hover:scale-110 aspect-square object-contain"
            />
            <p className="text-sm font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Category;
