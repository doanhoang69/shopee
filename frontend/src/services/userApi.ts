import type { CustomerInfo } from "@/constants/types";
import { rootApi } from "./baseApi";

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: CustomerInfo;
}

interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatarKey: string;
  };
}

type UpdateProfilePayload = Partial<CustomerInfo>;

export const customerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
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
  overrideExisting: false,
});

export const { useUpdateProfileMutation, useUpdateAvatarMutation } =
  customerApi;
