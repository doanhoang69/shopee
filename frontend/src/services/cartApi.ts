import type { PaginatedResponse } from "@/constants/types";
import { rootApi } from "./baseApi";

export interface CartItem {
  id: number;
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
}

export interface GetMyCartParams {
  page: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface AddToCartResponse {
  success: true;
  message: string;
}

export const cartApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query<PaginatedResponse<CartItem>, GetMyCartParams>({
      query: ({ page }) => ({
        url: "/carts",
        params: { page },
      }),
      providesTags: ["Cart"],
    }),
    getCartItemCount: builder.query<number, void>({
      query: () => ({
        url: "/carts/count",
      }),
      providesTags: ["CartItemCount"],
    }),
    addToCart: builder.mutation<AddToCartResponse, AddToCartRequest>({
      query: ({ productId, quantity }) => ({
        url: `/carts/${productId}`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Cart", "CartItemCount"],
    }),
    removeCartItem: builder.mutation<void, { productId: number }>({
      query: ({ productId }) => ({
        url: `/carts/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart", "CartItemCount"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useGetCartItemCountQuery,
  useAddToCartMutation,
  useRemoveCartItemMutation,
} = cartApi;
