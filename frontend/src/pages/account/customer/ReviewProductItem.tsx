import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import ProductImageBox from "../seller/ProductImageBox";
import RatingStar from "@/components/common/RatingStar";
import { Textarea } from "@/components/ui/textarea";
import {
  reviewProductSchema,
  type ReviewProductFormInput,
  type ReviewProductFormValues,
} from "@/schemas/review";
import {
  useReviewProductMutation,
  type UnreviewedProducts,
} from "@/services/reviewApi";
import Image from "@/components/ui/image";

interface ReviewProductItemProps {
  product: UnreviewedProducts;
}

const ReviewProductItem = ({ product }: ReviewProductItemProps) => {
  const [review, { isLoading: isReviewing }] = useReviewProductMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewProductFormInput, any, ReviewProductFormValues>({
    resolver: zodResolver(reviewProductSchema),
    defaultValues: {
      content: "",
      image: undefined,
      rating: 5,
    },
  });

  const formId = `add-product-form-${product.id}`;

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();

    if (values.image) {
      formData.append("image", values.image);
    }
    if (values.content) {
      formData.append("content", values.content);
    }
    formData.append("rating", String(values.rating));

    try {
      await review({
        productId: product.id,
        formData,
      }).unwrap();
      reset();
    } catch (err) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Image src={product.imagekey} alt="product_image" className="size-14" />

        <p className="line-clamp-2 text-ellipsis">{product.name}</p>
      </div>

      <form id={formId} onSubmit={submitHandler} className="space-y-6">
        {/* StarRating */}
        <div className="flex gap-4">
          <label
            htmlFor="rating"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Chất lượng sản phẩm
          </label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <RatingStar value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Nội dung */}
        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Nội dung
          </label>
          <Textarea
            id="content"
            placeholder="Nội dung đánh giá..."
            {...register("content")}
            className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-black placeholder:text-slate-400 ${
              errors.content ? "border-red-400 focus:ring-red-200" : ""
            }`}
          />
          {errors.content && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ProductImageBox
                value={field.value}
                onChange={field.onChange}
                error={errors.image?.message as string}
                className="w-50"
              />
            )}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            form={formId}
            disabled={isReviewing}
            className="h-10 px-6"
          >
            {isReviewing ? "Đang lưu..." : "Đánh giá"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewProductItem;
