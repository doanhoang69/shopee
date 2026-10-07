import UserAvatar from "@/components/common/UserAvatar";
import Image from "@/components/ui/image";
import { Rating } from "@/components/ui/rating";
import type { Review } from "@/services/reviewApi";
import dayjs from "dayjs";

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const { customer } = review;
  return (
    <div className="flex gap-2.5">
      <UserAvatar src={customer.avatarKey} className="size-10" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs">
            {customer.firstName} {customer.lastName}
          </p>

          <Rating value={review.rating} size={16} readOnly />
        </div>

        <p className="text-xs text-gray-500">
          {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm")}
        </p>

        {review.content && <p>{review.content}</p>}

        {review.imageKey && (
          <Image
            src={review.imageKey}
            alt="product_image"
            className="size-18"
          />
        )}
      </div>
    </div>
  );
};

export const ReviewItemSkeleton = () => {
  return (
    <div className="flex gap-2.5 animate-pulse">
      {/* avatar placeholder */}
      <div className="size-10 rounded-full bg-gray-200 shrink-0" />

      <div className="flex flex-col gap-3 flex-1">
        {/* name placeholder */}
        <div className="h-3 bg-gray-200 rounded w-24" />

        {/* rating placeholder */}
        <div className="h-3.5 bg-gray-200 rounded w-20" />

        {/* date placeholder */}
        <div className="h-3 bg-gray-200 rounded w-28" />

        {/* content placeholder - 2 lines */}
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 rounded w-200" />
        </div>

        {/* image placeholder */}
        <div className="size-18 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ReviewItem;
