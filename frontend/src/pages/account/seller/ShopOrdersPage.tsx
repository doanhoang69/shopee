import type { OrderStatus } from "@/constants";
import { useGetSellerOrdersInfiniteQuery } from "@/services/orderApi";
import { useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import OrderStatusTabs from "../customer/OrderStatusTabs";
import SellerOrderItem from "./SellerOrderItem";

const ShopOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get("status") ?? "ALL") as OrderStatus | "ALL";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetSellerOrdersInfiniteQuery({ status });

  const orders = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="grow">
      <OrderStatusTabs />

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Không có đơn hàng nào
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {orders.map((order) => (
            <Fragment key={order.id}>
              <SellerOrderItem {...order} />
            </Fragment>
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 w-full text-center text-sm text-blue-500 cursor-pointer"
        >
          {isFetchingNextPage ? "Đang tải thêm..." : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default ShopOrdersPage;
