import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import type { OrderStatus } from "@/constants";
import { useReceiveOrderMutation, type OrderItem } from "@/services/orderApi";
import { formatPrice } from "@/utils";
import dayjs from "dayjs";
import { toast } from "sonner";
import ReviewProductDialog from "./ReviewProductDialog";
import { useGetUnreviewedProductsQuery } from "@/services/reviewApi";

interface OrderCartItemProps {
  order: {
    id: number;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippedAt: string | null;
    createdAt: string;
  };
}

const OrderCartItem = ({ order }: OrderCartItemProps) => {
  const { id, items, totalAmount, status, shippedAt, createdAt } = order;
  const [receive, { isLoading }] = useReceiveOrderMutation();
  const { data } = useGetUnreviewedProductsQuery(id);
  const unreviewedProducts = data || [];

  const handleReceive = async () => {
    try {
      const { message } = await receive(id).unwrap();
      toast.success(message);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="flex flex-col gap-px">
      {items.map((item) => (
        <div key={item.id} className="bg-white">
          <p className="font-bold text-sm pt-4 px-5">
            {item.product.seller.shopName}
          </p>

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
            {status === "DELIVERED" && (
              <Button
                disabled={isLoading}
                className="w-40"
                onClick={handleReceive}
              >
                Đã nhận hàng
              </Button>
            )}

            {status === "COMPLETED" && unreviewedProducts.length !== 0 && (
              <ReviewProductDialog unreviewedProducts={unreviewedProducts} />
            )}

            <p className="flex items-center gap-3 text-sm">
              <span>Thành tiền:</span>
              <span className="text-xl text-primary">
                {formatPrice(totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCartItem;
