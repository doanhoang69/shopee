import type { CommonResponse } from "@/constants/types";
import { rootApi } from "./baseApi";
import type { OrderStatus } from "@/constants";

export interface Product {
  id: number;
  name: string;
  imageKey: string;
  originalPrice: number;
  isDiscount: boolean;
  discountPrice: number | null;
  seller: {
    shopName: string;
  };
}

export interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippedAt: string | null;
  createdAt: string;
}

interface CreateOrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderPayload {
  items: CreateOrderItem[];
  sellerId: number;
}

type OrderStatusFilter = OrderStatus | "ALL";

interface GetMyOrdersResponse {
  data: Order[];
  nextCursor: string | null;
}

interface GetMyOrdersArg {
  status: OrderStatusFilter;
}

export const orderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.infiniteQuery<
      GetMyOrdersResponse,
      GetMyOrdersArg,
      string | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/orders",
        params: {
          status: queryArg.status === "ALL" ? undefined : queryArg.status,
          cursor: pageParam,
        },
      }),
      providesTags: ["Order"],
    }),
    getSellerOrders: builder.infiniteQuery<
      GetMyOrdersResponse,
      GetMyOrdersArg,
      string | undefined
    >({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/orders/seller",
        params: {
          status: queryArg.status === "ALL" ? undefined : queryArg.status,
          cursor: pageParam,
        },
      }),
      providesTags: ["SellerOrder"],
    }),
    createOrder: builder.mutation<CommonResponse, CreateOrderPayload>({
      query: (body) => ({
        url: `/orders`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    confirmOrder: builder.mutation<CommonResponse, number>({
      query: (orderId) => ({
        url: `/orders/confirm/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SellerOrder"],
    }),
    receiveOrder: builder.mutation<CommonResponse, number>({
      query: (orderId) => ({
        url: `/orders/receive/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersInfiniteQuery,
  useGetSellerOrdersInfiniteQuery,
  useCreateOrderMutation,
  useConfirmOrderMutation,
  useReceiveOrderMutation,
} = orderApi;
