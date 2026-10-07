import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/services/customer/getMe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AvatarBox from "./AvatarBox";

const ProfilePage = () => {
  const { data: userInfo, isLoading: isLoadingUserInfo } = useGetMeQuery();

  if (isLoadingUserInfo || !userInfo) {
    return null; // hoặc <Spinner /> tuỳ bạn
  }

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [isEditting, setIsEditting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
      });
    }
  }, [userInfo, reset]);

  const handleEditProfile = () => {
    setIsEditting(true);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const result = await updateProfile(values).unwrap();
    reset(result.data);

    setIsEditting(false);
  };

  const renderField = (
    label: string,
    id: keyof ProfileFormValues,
    value: string,
  ) => (
    <div className="flex items-center gap-4">
      <label htmlFor={id} className="text-gray-500 text-sm w-28 shrink-0">
        {label}
      </label>

      {isEditting ? (
        <div className="flex flex-col gap-1 flex-1">
          <input
            type="text"
            id={id}
            {...register(id)}
            className="border border-gray-200 text-sm px-3 py-2"
          />
          {errors[id] && (
            <span className="text-red-500 text-xs">{errors[id]?.message}</span>
          )}
        </div>
      ) : (
        <p id={id} className="text-sm">
          {value ? value : "..."}
        </p>
      )}
    </div>
  );

  const handleCancel = () => {
    reset({
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName,
      email: userInfo?.email,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
    setIsEditting(false);
  };

  if (!userInfo) {
    return (
      <div className="h-100 flex justify-center items-center text-lg text-gray-500">
        Không tìm thấy dữ liệu người dùng
      </div>
    );
  }

  return (
    <div className="grow bg-white rounded-xs p-6">
      <p className="text-lg font-medium border-b border-gray-200 pb-4">
        Hồ Sơ Của Tôi
      </p>

      <div className="grid grid-cols-[2fr_1fr] pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-r border-gray-200 p-5"
        >
          <div className="flex flex-col gap-4 mb-4">
            {renderField("Họ", "lastName", userInfo.lastName)}
            {renderField("Tên", "firstName", userInfo.firstName)}
            {renderField("Email", "email", userInfo.email)}
            {renderField("Số điện thoại", "phone", userInfo.phone)}
            {renderField("Địa chỉ", "address", userInfo.address)}
          </div>

          {isEditting ? (
            <div className="flex gap-3">
              <Button
                type="submit"
                className="h-11 w-30"
                disabled={!isDirty || isLoading}
              >
                Lưu
              </Button>

              <Button
                variant="outline"
                className="h-11 w-30"
                onClick={handleCancel}
              >
                Huỷ
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              className="h-11 w-30"
              onClick={handleEditProfile}
            >
              Chỉnh sửa
            </Button>
          )}
        </form>

        {/* AVATAR */}
        <AvatarBox avatarKey={userInfo.avatarKey} />
      </div>
    </div>
  );
};

export default ProfilePage;
