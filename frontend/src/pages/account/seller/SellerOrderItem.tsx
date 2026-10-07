import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import type { OrderStatus } from "@/constants";
import { useConfirmOrderMutation } from "@/services/orderApi";
import { formatPrice } from "@/utils";
import dayjs from "dayjs";
import { toast } from "sonner";

interface Product {
  name: string;
  imageKey: string;
  originalPrice: number;
  isDiscount: boolean;
  discountPrice: number | null;
}

interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

interface SellerOrderItemProps {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippedAt: string | null;
  createdAt: string;
}

const SellerOrderItem = ({
  id,
  items,
  totalAmount,
  status,
  shippedAt,
  createdAt,
}: SellerOrderItemProps) => {
  const [confirmOrder, { isLoading }] = useConfirmOrderMutation();

  const handleConfirmOrder = async () => {
    try {
      const { message } = await confirmOrder(id).unwrap();
      toast.success(message);
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex flex-col gap-px">
      {items.map((item) => (
        <div key={item.id} className="bg-white">
          <div className="p-5 flex items-center justify-between gap-60">
            <div className="flex items-center gap-3">
              <Image
                src={item.product.imageKey}
                alt="product_image"
                className="w-20"
              />

              <div className="h-20 flex flex-col justify-between">
                <p className="text-base line-clamp-2 text-ellipsis">
                  {item.product.name}
                </p>

                <span className="text-sm">x{item.quantity}</span>
              </div>
            </div>

            <div className="flex gap-2 text-sm">
              {item.product.isDiscount && (
                <span className="text-gray-400 line-through">
                  {formatPrice(item.product.originalPrice)}
                </span>
              )}
              <span className="text-primary">
                {item.product.isDiscount
                  ? formatPrice(item.product.discountPrice)
                  : formatPrice(item.product.originalPrice)}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-[#fffefb] p-5">
        <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
          {shippedAt ? (
            <p>
              Đã giao hàng lúc: {dayjs(shippedAt).format("HH[h]mm DD/MM/YYYY")}
            </p>
          ) : (
            <p>Đã đặt lúc: {dayjs(createdAt).format("HH[h]mm DD/MM/YYYY")}</p>
          )}

          <div className="flex gap-3">
            {status === "ORDERED" && (
              <Button
                disabled={isLoading}
                className="w-30"
                onClick={handleConfirmOrder}
              >
                Xác nhận
              </Button>
            )}

            <div className="flex items-center gap-3 text-sm">
              <span>Thành tiền:</span>
              <span className="text-xl text-primary">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderItem;
