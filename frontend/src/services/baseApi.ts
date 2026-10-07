import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          // refreshToken cũng hết hạn -> gọi thẳng API logout để BE clear cookie
          await baseQuery(
            { url: "/auth/logout", method: "POST" },
            api,
            extraOptions,
          );

          // clear toàn bộ cache RTK Query
          api.dispatch(rootApi.util.resetApiState());
          // điều hướng về trang login
          window.location.href = "/login";
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: "rootApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "CurrentUser",
    "Product",
    "Cart",
    "Order",
    "SellerOrder",
    "CartItemCount",
    "ShopProducts",
    "Notifications",
    "Reviews",
    "UnreviewedProducts",
  ],
  endpoints: () => ({}),
});
