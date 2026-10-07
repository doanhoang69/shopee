import { useSearchParams } from "react-router-dom";
import { cn } from "@/utils";

const ORDER_STATUS_TABS = [
  { value: "ALL", label: "Tất cả" },
  { value: "ORDERED", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPED", label: "Đang vận chuyển" },
  { value: "DELIVERED", label: "Đã giao hàng" },
  { value: "COMPLETED", label: "Hoàn tất" },
] as const;

const OrderStatusTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "ALL";

  const handleChangeStatus = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("status", value);
      return next;
    });
  };

  return (
    <div className="flex w-full bg-white">
      {ORDER_STATUS_TABS.map(({ value, label }) => {
        const isActive = currentStatus === value;

        return (
          <div
            key={value}
            onClick={() => handleChangeStatus(value)}
            className={cn(
              "flex-1 py-4 text-base text-center border-b-2 border-transparent transition-colors cursor-pointer",
              isActive
                ? "text-primary border-b-primary"
                : "text-black hover:text-primary",
            )}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTabs;
