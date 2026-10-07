import { CATEGORIES } from "@/constants";
import { useNavigate } from "react-router-dom";

interface CategoryListProps {
  layout?: "vertical" | "horizontal";
  className?: string;
}

const CategoryList = ({
  layout = "horizontal",
  className,
}: CategoryListProps) => {
  const navigate = useNavigate();

  const handleFilterProducts = (categoryId: number) => {
    navigate(`/products?categoryId=${categoryId}`);
  };

  return (
    <section
      className={`bg-white border border-gray-200 rounded-sm, ${className}`}
    >
      <p className="text-gray-500 text-sm font-medium px-4 py-3 border-b border-gray-200">
        DANH MỤC
      </p>

      <div
        className={`flex divide-x divide-gray-200 ${layout === "vertical" && "flex-col"}`}
      >
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className={`flex-1 flex flex-col items-center gap-3 px-3 py-5 cursor-pointer ${layout === "vertical" && "flex-row"}`}
            onClick={() => handleFilterProducts(cat.key)}
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              <img
                src={cat.imageKey}
                alt={cat.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-700 text-center leading-snug">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
