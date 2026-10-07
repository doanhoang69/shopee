import { rootApi } from "@/services/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "@/pages/checkout/slice";

export const rootStore = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    checkout: checkoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware),
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;
