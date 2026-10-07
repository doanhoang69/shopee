import Image from "@/components/ui/image";
import { formatPrice } from "@/utils";
import type { Product } from "@/services/product";
import { useNavigate } from "react-router-dom";

interface PropductItemProps {
  product: Product;
}

const ProductItem = ({ product }: PropductItemProps) => {
  const {
    id,
    name,
    imageKey,
    originalPrice,
    isDiscount,
    discountPrice,
    ratingAvg,
    soldQuantity,
  } = product;

  const navigate = useNavigate();

  const handleGoToProductDetial = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div
      className="border border-gray-300 rounded-sm hover:border-primary cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-sm hover:shadow-primary/20 duration-100"
      onClick={() => handleGoToProductDetial(id)}
    >
      <Image src={imageKey} alt="product_image" className="block w-full" />

      <div className="p-2">
        <p className="line-clamp-2 text-ellipsis text-black text-sm">{name}</p>

        <div className="h-16 flex flex-col justify-between">
          <div className="mt-1 flex items-center gap-2">
            <span className="text-primary">
              {isDiscount
                ? formatPrice(discountPrice)
                : formatPrice(originalPrice)}
            </span>
            {isDiscount && (
              <span className="text-gray-400 line-through text-xs">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs leading-normal">
            <span>{ratingAvg}</span>
            <span>{soldQuantity} đã bán</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductItemSkeleton = () => {
  return (
    <div className="h-75 border border-gray-300 rounded-sm overflow-hidden animate-pulse">
      {/* image placeholder */}
      <div className="w-full aspect-square bg-gray-200" />

      <div className="p-2">
        {/* name placeholder - 2 lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        </div>

        <div className="h-16 flex flex-col justify-between mt-1">
          {/* price placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-14" />
            <div className="h-3 bg-gray-200 rounded w-10" />
          </div>

          {/* rating / sold placeholder */}
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-8" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
