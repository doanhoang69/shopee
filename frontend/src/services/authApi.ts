import { rootApi } from "./baseApi";
import type { CommonResponse } from "@/constants/types";

interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<CommonResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<CommonResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["CurrentUser"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Xóa sạch toàn bộ cache của rootApi (Cart, Order, Notifications...)
          dispatch(rootApi.util.resetApiState());
        } catch (error) {
          // logout thất bại (network lỗi, server lỗi...)
          // tùy bạn: vẫn có thể reset cache ở FE hoặc không
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
