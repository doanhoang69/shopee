import type { UserRole } from "@/constants/types";
import { rootApi } from "../baseApi";

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  shopName: string;
  email: string;
  avatarKey: string;
  phone: string;
  address: string;
  role: UserRole;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserInfo;
}

interface UpdateAvatarResponse {
  success: boolean;
  message: string;
}

type UpdateProfilePayload = Partial<UserInfo>;

export const customerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserInfo, void>({
      query: () => ({
        url: "/users/me",
      }),
      providesTags: ["CurrentUser"],
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: "/users",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CurrentUser"],
    }),
    updateAvatar: builder.mutation<UpdateAvatarResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/users/avatar",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CurrentUser"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = customerApi;
