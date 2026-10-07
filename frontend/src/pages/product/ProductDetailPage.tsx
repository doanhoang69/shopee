import QuantityBox from "@/components/common/QuantityBox";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { formatCount, formatPrice, getEstimatedDeliveryRange } from "@/utils";
import { useAddToCartMutation } from "@/services/cartApi";
import { useGetProductDetailQuery } from "@/services/product";
import { Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { setCheckoutItems } from "../checkout/slice";
import { Rating } from "@/components/ui/rating";
import ReviewList from "./ReviewList";
import NotFountPage from "../NotFountPage";
import LoadingScreen from "@/components/common/LoadingScreen";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { productId } = useParams();
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: isLoadingProductDetail } =
    useGetProductDetailQuery(Number(productId));

  if (isLoadingProductDetail) {
    return <LoadingScreen />;
  }

  if (!product) {
    return <NotFountPage />;
  }

  const handleAddToCart = async () => {
    try {
      const { message } = await addToCart({
        productId: product.id,
        quantity,
      }).unwrap();

      toast.success(message);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleGoToCheckout = () => {
    dispatch(
      setCheckoutItems([
        {
          id: 1,
          quantity,
          product,
        },
      ]),
    );
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xs p-4 flex gap-8">
        <Image
          src={product.imageKey}
          alt="product_image"
          className="size-112"
        />

        <div>
          <p className="text-xl leading-normal">{product.name}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 relative">
              {product.ratingAvg}
              <Rating readOnly value={product.ratingAvg} size={16} />
              <span className="absolute w-5.5 h-[0.5px] bg-black bottom-0.5"></span>
            </div>
            <p>
              {product.reviewCount}{" "}
              <span className="text-gray-500 text-sm">Đánh Giá</span>
            </p>
            <p>
              <span className="text-gray-500 text-sm">Đã bán</span>{" "}
              {formatCount(product.soldQuantity)}
            </p>
          </div>

          <p className="mt-2 bg-gray-50 px-4 py-5 rounded-xs flex items-center gap-2.5">
            <span className="text-primary text-3xl">
              {product.isDiscount
                ? formatPrice(product.discountPrice)
                : formatPrice(product.originalPrice)}
            </span>
            {product.isDiscount && (
              <span className="text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </p>

          <div className="grid grid-cols-[250px_1fr] gap-y-6 px-5 py-4 text-sm text-teal-600">
            {/* Hàng 1: Vận Chuyển */}
            <div className="text-gray-500">Vận Chuyển</div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>{getEstimatedDeliveryRange()}</span>
            </div>

            {/* Hàng 2: An Tâm Mua Sắm Cùng Shopee */}
            <div className="text-gray-500">An Tâm Mua Sắm Cùng Shopee</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Trả hàng miễn phí 15 ngày</span>
            </div>

            <div className="text-gray-500">Số lượng</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <QuantityBox
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stockQuantity}
              />
              <p>{product.stockQuantity} sản phẩm có sẵn</p>
            </div>
          </div>

          <div className="flex gap-3 *:rounded-xs *:h-12 *:px-6">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              disabled={isLoading}
              onClick={handleAddToCart}
            >
              <ShoppingCart /> Thêm Vào Giỏ Hàng
            </Button>
            <Button className="w-50" onClick={handleGoToCheckout}>
              Mua Ngay
            </Button>
          </div>
        </div>
      </div>

      <ReviewList productId={product.id} />
    </div>
  );
};

export default ProductDetailPage;
