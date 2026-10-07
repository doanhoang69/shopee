import { rootApi } from "./baseApi";
import type { NotificationType } from "@/constants/types";

interface Notification {
  id: number;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
      }),
      providesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkAllAsReadMutation } =
  notificationApi;
