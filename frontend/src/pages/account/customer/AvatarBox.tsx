import { Button } from "@/components/ui/button";
import { ACCEPTED_AVATAR_TYPES, MAX_AVATAR_SIZE } from "@/constants";
import { useUpdateAvatarMutation } from "@/services/customer/getMe";
import { useEffect, useRef, useState } from "react";
import UserAvatar from "@/components/common/UserAvatar";

interface AvatarBoxProps {
  avatarKey: string;
}

const AvatarBox = ({ avatarKey }: AvatarBoxProps) => {
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseAvatar = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Chỉ hỗ trợ định dạng .jpeg, .png, .webp");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("Dung lượng file tối đa 1 MB");
      e.target.value = "";
      return;
    }

    setAvatarError("");
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setAvatarFile(file);
  };

  const handleCancelPreview = () => {
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setAvatarFile(null);
    setAvatarError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;

    try {
      await updateAvatar(avatarFile).unwrap();
      handleCancelPreview();
    } catch (err) {
      console.error("Upload avatar failed:", err);
      setAvatarError("Cập nhật ảnh đại diện thất bại, vui lòng thử lại");
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="user_avatar"
            className="size-25 rounded-full object-cover"
          />
        ) : (
          <UserAvatar src={avatarKey} className="size-25 rounded-full" />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {avatarPreview ? (
          <div className="flex gap-2">
            <Button
              type="button"
              className="h-10 w-25 text-sm"
              onClick={handleSaveAvatar}
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-25 text-sm"
              onClick={handleCancelPreview}
              disabled={isLoading}
            >
              Huỷ
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="bg-transparent w-25 h-10 hover:bg-gray-100 text-black text-sm font-normal border border-gray-300"
            onClick={handleChooseAvatar}
            disabled={isLoading}
          >
            Chọn Ảnh
          </Button>
        )}

        <p className="text-gray-500 text-sm flex flex-col">
          <span>Dung lượng file tối đa 1 MB</span>
          <span>Định dạng: .jpeg, .png, .webp</span>
        </p>

        {avatarError && (
          <span className="text-red-500 text-xs text-center">
            {avatarError}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvatarBox;
