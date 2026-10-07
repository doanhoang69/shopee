import Image from "@/components/ui/image";
import { formatPrice } from "@/utils";
import { Link } from "react-router-dom";

interface CheckoutItemProps {
  quantity: number;
  product: {
    id: number;
    name: string;
    imageKey: string;
    originalPrice: number;
    isDiscount: boolean;
    discountPrice: number;
    seller: {
      id: number;
      shopName: string;
    };
  };
}

const CheckoutItem = ({ quantity, product }: CheckoutItemProps) => {
  const { name, imageKey, originalPrice, isDiscount, discountPrice, seller } =
    product;

  const price = isDiscount ? discountPrice : originalPrice;

  return (
    <div className="bg-white shadow-xs p-6 grid grid-cols-[300px_1fr_1fr_1fr] items-center gap-x-10 text-sm">
      <div className="flex items-center gap-3">
        <Image src={imageKey} alt="product_logo" className="size-10" />
        <div>
          <p className="line-clamp-1 text-ellipsis">{name}</p>
          <Link to={`/shop/${seller.id}`} className="text-gray-500">
            Shop:{" "}
            <span className="text-black cursor-pointer hover:text-primary duration-150">
              {seller.shopName}
            </span>
          </Link>
        </div>
      </div>

      <p className="flex flex-col gap-0.5 text-primary">
        {isDiscount ? formatPrice(discountPrice) : formatPrice(originalPrice)}
        {isDiscount && (
          <span className="text-gray-500 line-through text-xs">
            {formatPrice(originalPrice)}
          </span>
        )}
      </p>

      <p>{quantity}</p>

      <p>{formatPrice(quantity * price)}</p>
    </div>
  );
};

export default CheckoutItem;
