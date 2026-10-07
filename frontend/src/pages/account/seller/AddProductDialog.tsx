import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/constants";
import {
  type ProductFormInput,
  type ProductFormValues,
  productSchema,
} from "@/schemas/product";
import { useDisplayProductMutation } from "@/services/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import ProductImageBox from "./ProductImageBox";
import { toast } from "sonner";

const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const [display, { isLoading: isDisplaying }] = useDisplayProductMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, any, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      image: undefined,
      categoryId: undefined,
      originalPrice: undefined,
      isDiscount: false,
      discountPrice: undefined,
      stockQuantity: undefined,
    },
  });

  const hasDiscount = watch("isDiscount");

  const submitHandler = handleSubmit(async (values) => {
    const formData = new FormData();

    formData.append("image", values.image);
    formData.append("name", values.name);
    formData.append("categoryId", String(values.categoryId));
    formData.append("originalPrice", String(values.originalPrice));
    formData.append("isDiscount", String(values.isDiscount));
    if (values.isDiscount && values.discountPrice) {
      formData.append("discountPrice", String(values.discountPrice));
    }
    formData.append("stockQuantity", String(values.stockQuantity));

    try {
      await display(formData).unwrap();
      reset();
      setOpen(false);
    } catch (err) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    }
  });

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm h-11 px-6 rounded-sm cursor-pointer">
          <Plus className="size-5" />
          Thêm mặt hàng
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-250">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Thông tin sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className=" flex-1 flex items-center justify-center">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ProductImageBox
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message as string}
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <form
              id="add-product-form"
              onSubmit={submitHandler}
              className="flex-1 space-y-6 overflow-y-auto px-6 py-5"
            >
              {/* 1. Tên sản phẩm */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Tên sản phẩm
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ví dụ: Áo thun cotton nam"
                  {...register("name")}
                  className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-black placeholder:text-slate-400 ${
                    errors.name ? "border-red-400 focus:ring-red-200" : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* 2. Danh mục sản phẩm */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Danh mục sản phẩm
                </label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <div className="grid grid-cols-4 gap-2.5">
                      {CATEGORIES.map((category) => {
                        const selected = field.value === category.key;
                        return (
                          <div
                            key={category.key}
                            onClick={() => field.onChange(category.key)}
                            aria-pressed={selected}
                            className={`flex items-center gap-2 rounded-lg border hover:border-primary px-2 py-2 text-left duration-150 cursor-pointer ${
                              selected
                                ? "border-primary bg-primary/5 ring-0.5 ring-primary"
                                : "border-slate-200 hover:bg-primary/5"
                            }`}
                          >
                            <img
                              src={category.imageKey}
                              alt={category.label}
                              className="size-8 shrink-0 rounded-md object-cover"
                            />
                            <span
                              className={`truncate text-xs font-medium ${
                                selected ? "text-primary" : "text-gray-600"
                              }`}
                            >
                              {category.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.categoryId && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* 3. Giá gốc */}
              <div>
                <label
                  htmlFor="originalPrice"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Giá gốc
                </label>
                <div className="relative">
                  <input
                    id="originalPrice"
                    type="number"
                    min={0}
                    step="1000"
                    placeholder="0"
                    {...register("originalPrice")}
                    className={`w-full rounded-lg border px-3.5 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.originalPrice
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-300 focus:border-teal-500 focus:ring-teal-100"
                    }`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-slate-400">
                    VNĐ
                  </span>
                </div>
                {errors.originalPrice && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.originalPrice.message}
                  </p>
                )}
              </div>

              {/* 4. Checkbox Giảm giá */}
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  {...register("isDiscount")}
                  className="size-4 rounded border-slate-300 bg-primary"
                />
                <span className="text-sm font-medium text-slate-700">
                  Giảm giá
                </span>
              </label>

              {/* 5. Giá khuyến mãi */}
              {hasDiscount && (
                <div>
                  <label
                    htmlFor="discountPrice"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Giá khuyến mãi
                  </label>
                  <div className="relative">
                    <input
                      id="discountPrice"
                      type="number"
                      min={0}
                      step="1000"
                      placeholder="0"
                      {...register("discountPrice")}
                      className={`w-full rounded-lg border px-3.5 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors.discountPrice
                          ? "border-red-400 focus:ring-red-200"
                          : "border-slate-300 focus:border-teal-500 focus:ring-teal-100"
                      }`}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-slate-400">
                      VNĐ
                    </span>
                  </div>
                  {errors.discountPrice && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              )}

              {/* 6. Số lượng trong kho */}
              <div>
                <label
                  htmlFor="stock"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Số lượng trong kho
                </label>
                <input
                  id="stock"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="0"
                  {...register("stockQuantity")}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.stockQuantity
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-300 focus:border-teal-500 focus:ring-teal-100"
                  }`}
                />
                {errors.stockQuantity && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                disabled={isDisplaying}
                className="rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDisplaying ? "Đang lưu..." : "Thêm sản phẩm"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
