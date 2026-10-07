import type { CommonResponse, PaginatedResponse } from "@/constants/types";
import { rootApi } from "./baseApi";

export interface Product {
  id: number;
  name: string;
  imageKey: string;
  originalPrice: number;
  isDiscount: boolean;
  discountPrice: number;
  soldQuantity: number;
  reviewCount: number;
  stockQuantity: number;
  ratingAvg: number;
  seller: {
    id: number;
    shopName: string;
  };
}

export interface GetAllProductsParams {
  page: number;
  categoryId?: number;
  search?: string;
  sortBy?: "price" | "sales" | "time";
  order?: "asc" | "desc";
  sellerId?: number;
}

export const productsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      PaginatedResponse<Product>,
      GetAllProductsParams | void
    >({
      query: (params) => ({
        url: "/products",
        params: params ?? {},
      }),
      providesTags: ["Product"],
    }),
    getMyShopProducts: builder.query<
      PaginatedResponse<Product>,
      GetAllProductsParams | void
    >({
      query: (params) => ({
        url: "/products",
        params: params ?? {},
      }),
      providesTags: ["ShopProducts"],
    }),
    getProductDetail: builder.query<Product, number>({
      query: (productId) => ({
        url: `/products/${productId}`,
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    displayProduct: builder.mutation<CommonResponse, FormData>({
      query: (formData) => ({
        url: `/products`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ShopProducts"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetMyShopProductsQuery,
  useGetProductDetailQuery,
  useDisplayProductMutation,
} = productsApi;
