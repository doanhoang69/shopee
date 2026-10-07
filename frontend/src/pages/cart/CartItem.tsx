import QuantityBox from "@/components/common/QuantityBox";
import Image from "@/components/ui/image";
import { formatPrice } from "@/utils";
import { useRemoveCartItemMutation } from "@/services/cartApi";
import { Link } from "react-router-dom";

interface CartItemProps {
  quantity: number;
  product: {
    id: number;
    name: string;
    imageKey: string;
    originalPrice: number;
    isDiscount: boolean;
    discountPrice: number;
    stockQuantity: number;
    seller: {
      id: number;
      shopName: string;
    };
  };
  checked: boolean;
  amount: number;
  onCheckedChange: (checked: boolean) => void;
  onAmountChange: (value: number) => void;
}

const CartItem = ({
  product,
  checked,
  amount,
  onCheckedChange,
  onAmountChange,
}: CartItemProps) => {
  const {
    id,
    name,
    imageKey,
    originalPrice,
    isDiscount,
    discountPrice,
    stockQuantity,
    seller,
  } = product;

  const [removeCartItem] = useRemoveCartItemMutation();

  const handleRemoveCartItem = async () => {
    await removeCartItem({ productId: id }).unwrap();
  };

  return (
    <div className="bg-white px-4 rounded-xs shadow-sm text-sm">
      <div className="border-b border-gray-20 py-4 flex items-center gap-2">
        <p>{seller.shopName}</p>
        <Link
          to={`/shop/${seller.id}`}
          className="text-link text-xs hover:underline"
        >
          Xem thêm Shop
        </Link>
      </div>

      {/* PRODUCT INFO */}
      <div className="py-4 grid grid-cols-[auto_500px_1fr_1fr_1fr_1fr] items-center justify-between">
        <div className="pr-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="size-4 border border-gray-200 cursor-pointer accent-primary"
          />
        </div>

        <div className="flex gap-2">
          <Image src={imageKey} alt="product_image" className="size-20" />
          <p className="line-clamp-2 text-ellipsis">{name}</p>
        </div>

        <p className="text-primary text-center">
          {isDiscount ? formatPrice(discountPrice) : formatPrice(originalPrice)}
        </p>

        <div className="text-center">
          <QuantityBox
            value={amount}
            onChange={onAmountChange}
            max={stockQuantity}
          />
          <p className="mt-2">Còn {stockQuantity} sản phẩm</p>
        </div>

        <p className="text-primary text-center">
          Thành tiền:{" "}
          {formatPrice(
            isDiscount ? discountPrice * amount : originalPrice * amount,
          )}
        </p>

        <p
          className="hover:text-primary duration-150 cursor-pointer text-center"
          onClick={handleRemoveCartItem}
        >
          Xoá
        </p>
      </div>
    </div>
  );
};

export default CartItem;
