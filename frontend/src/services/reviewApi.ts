import type { CommonResponse, PaginatedResponse } from "@/constants/types";
import { rootApi } from "./baseApi";

export interface Review {
  id: number;
  content: string;
  imageKey: string | null;
  rating: number;
  customer: {
    firstName: string;
    lastName: string;
    avatarKey: string | null;
  };
  createdAt: string;
}

export interface GetAllReviewsParams {
  page: number;
  productId: number;
}

interface ReviewProductPayload {
  formData: FormData;
  productId: number;
}

export interface UnreviewedProducts {
  id: number;
  name: string;
  imagekey: string;
}

export const reviewApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<
      PaginatedResponse<Review>,
      GetAllReviewsParams
    >({
      query: ({ productId, page }) => ({
        url: `/products/${productId}/reviews`,
        params: { page },
      }),
      providesTags: ["Reviews"],
    }),
    getUnreviewedProducts: builder.query<UnreviewedProducts[], number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/unreviewed`,
      }),
      providesTags: ["UnreviewedProducts"],
    }),
    reviewProduct: builder.mutation<CommonResponse, ReviewProductPayload>({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews", "UnreviewedProducts"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetUnreviewedProductsQuery,
  useReviewProductMutation,
} = reviewApi;
