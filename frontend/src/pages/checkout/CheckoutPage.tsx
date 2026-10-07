import { useGetMeQuery } from "@/services/customer/getMe";
import type { RootState } from "@/store";
import { MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import CheckoutItem from "./CheckoutItem";
import { formatPrice } from "@/utils";
import { Button } from "@/components/ui/button";
import { SHIPPING_COST } from "@/constants";
import { useCreateOrderMutation } from "@/services/orderApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkoutItems = useSelector((state: RootState) => state.checkout.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { data, isLoading: isLoadingUser } = useGetMeQuery();

  if (isLoadingUser || !data) {
    return null; // hoặc <Spinner /> tuỳ bạn
  }

  const userInfo = data;

  const calculateTotalAmount = () => {
    const total = checkoutItems.reduce((acc, item) => {
      const price = item.product.isDiscount
        ? item.product.discountPrice
        : item.product.originalPrice;
      return acc + item.quantity * price;
    }, 0);

    return total;
  };

  const totalAmount = calculateTotalAmount();

  const handleCreateOrder = async () => {
    const orderItems = checkoutItems.map((item) => {
      return {
        productId: item.product.id,
        quantity: item.quantity,
      };
    });

    const sellerId = checkoutItems[0].product.seller.id;

    try {
      const { message } = await createOrder({
        items: orderItems,
        sellerId,
      }).unwrap();
      toast.success(message);
      navigate("/account/orders");
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className="mt-30">
      {/* ĐỊA CHỈ */}
      <div className="p-8 bg-white mb-3">
        <p className="flex items-center gap-2 text-primary mb-4">
          <MapPin className="size-5" />
          <span className="text-lg">Địa Chỉ Nhận Hàng</span>
        </p>

        <div className="flex items-center gap-3">
          <p className="font-semibold text-base">
            {userInfo.firstName} {userInfo.lastName} {userInfo.phone}
          </p>

          <p>{userInfo.address}</p>

          <p className="text-link text-sm hover:underline cursor-pointer duration-150">
            Thay Đổi
          </p>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="flex justify-between gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-[300px_1fr_1fr_1fr] items-center gap-x-10 text-sm text-gray-500 bg-white px-6 py-4">
            <p className="text-lg text-black">Sản phẩm</p>
            <p>Đơn giá</p>
            <p>Số lượng</p>
            <p>Thành tiền</p>
          </div>

          {checkoutItems.map((item) => (
            <CheckoutItem key={item.id} {...item} />
          ))}
        </div>

        <div className="p-6 bg-white shadow">
          <p className="pb-5 border-b border-gray-200">
            Thanh toán khi nhận hàng
          </p>

          <div className="w-80 mx-auto rounded-lg py-5">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 text-sm">Tổng tiền hàng</span>
              <span className="text-gray-800 text-sm">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 text-sm">
                Tổng tiền phí vận chuyển
              </span>
              <span className="text-gray-800 text-sm">
                {formatPrice(SHIPPING_COST)}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-300 my-3" />

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 text-sm">Tổng thanh toán</span>
              <span className="text-orange-600 text-2xl font-semibold">
                {formatPrice(totalAmount + SHIPPING_COST)}
              </span>
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-11 mt-4 text-base"
              onClick={handleCreateOrder}
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
