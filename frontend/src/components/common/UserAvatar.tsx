import { cn } from "@/utils";

interface UserAvatarProps {
  src: string | null;
  className?: string;
}

const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <img
      src={`${import.meta.env.VITE_CDN_BASE_URL}/${src ? src : "avatars/default.png"}`}
      alt="user_avatar"
      className={cn("size-5 rounded-full", className)}
    />
  );
};

export default UserAvatar;
