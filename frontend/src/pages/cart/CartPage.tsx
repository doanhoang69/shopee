import { useEffect, useState } from "react";
import { useGetMyCartQuery } from "@/services/cartApi";
import CartItem from "./CartItem";
import { formatPrice } from "@/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setCheckoutItems } from "../checkout/slice";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useGetMyCartQuery({
    page: 1,
  });

  const cartItems = data?.data || [];

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [amounts, setAmounts] = useState<Record<number, number>>({});

  // khởi tạo amounts khi data từ API load xong
  useEffect(() => {
    if (cartItems.length > 0) {
      setAmounts((prev) => {
        const next = { ...prev };
        cartItems.forEach((item) => {
          if (next[item.product.id] === undefined) {
            next[item.product.id] = item.quantity;
          }
        });
        return next;
      });
    }
  }, [cartItems]);

  const handleToggleSelect = (productId: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const handleAmountChange = (productId: number, value: number) => {
    setAmounts((prev) => ({ ...prev, [productId]: value }));
  };

  const totalPrice = cartItems
    .filter((item) => selectedIds.has(item.product.id))
    .reduce((sum, item) => {
      const { product } = item;
      const price = product.isDiscount
        ? product.discountPrice
        : product.originalPrice;
      const amount = amounts[product.id] ?? item.quantity;
      return sum + price * amount;
    }, 0);

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) =>
      selectedIds.has(item.product.id),
    );

    if (selectedItems.length === 0) return;

    dispatch(setCheckoutItems(selectedItems));
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="mt-30 flex flex-col items-center justify-center gap-4">
        <img src="/empty_cart.png" alt="empty_cart" className="w-50" />
        <p className="text-gray-500 font-medium">Giỏ hàng của bạn còn trống</p>
        <Button className="rounded-xs px-8 h-11" onClick={() => navigate("/")}>
          MUA NGAY
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-30 flex flex-col gap-4">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          quantity={item.quantity}
          product={item.product}
          checked={selectedIds.has(item.product.id)}
          amount={amounts[item.product.id] ?? item.quantity}
          onCheckedChange={(checked) =>
            handleToggleSelect(item.product.id, checked)
          }
          onAmountChange={(value) => handleAmountChange(item.product.id, value)}
        />
      ))}
      <div className="fixed bottom-0 z-10 w-300 mx-auto flex items-center justify-between bg-white p-4">
        <p>Đã chọn ({selectedIds.size}) sản phẩm</p>

        <div className="flex items-center gap-3">
          <p>
            Tổng cộng:{" "}
            <span className="text-primary">{formatPrice(totalPrice)}</span>
          </p>
          <Button
            disabled={selectedIds.size === 0}
            className="rounded-xs w-50 h-11"
            onClick={handleCheckout}
          >
            Mua hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
