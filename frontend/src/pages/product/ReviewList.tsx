import { useGetAllReviewsQuery } from "@/services/reviewApi";
import { useSearchParams } from "react-router-dom";
import ReviewItem, { ReviewItemSkeleton } from "./ReviewItem";

interface ReviewListProps {
  productId: number;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const {
    data,
    isFetching: isLoadingReviews,
    isError,
  } = useGetAllReviewsQuery({ page, productId });

  const reviewsList = data ? data.data : [];

  return (
    <div className="bg-white p-4">
      <p className="text-xl uppercase mb-6">ĐÁNH GIÁ SẢN PHẨM</p>

      {isLoadingReviews ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReviewItemSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-75 text-gray-500 text-sm">
          Đã có lỗi xảy ra, vui lòng thử lại sau.
        </div>
      ) : reviewsList.length === 0 ? (
        <div className="flex items-center justify-center h-75 text-gray-500 text-sm">
          Chưa có đánh giá
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {reviewsList.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
