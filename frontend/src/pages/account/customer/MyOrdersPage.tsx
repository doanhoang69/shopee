import { useSearchParams } from "react-router-dom";
import OrderStatusTabs from "./OrderStatusTabs";
import { useGetMyOrdersInfiniteQuery } from "@/services/orderApi";
import type { OrderStatus } from "@/constants";
import { Fragment } from "react/jsx-runtime";
import OrderCartItem from "./OrderCartItem";

const MyOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get("status") ?? "ALL") as OrderStatus | "ALL";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetMyOrdersInfiniteQuery({ status });

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
              <OrderCartItem order={order} />
            </Fragment>
          ))}
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 text-sm text-blue-500"
        >
          {isFetchingNextPage ? "Đang tải thêm..." : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default MyOrdersPage;
