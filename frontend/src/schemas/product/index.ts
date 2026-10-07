import z from "zod";

export const productSchema = z
  .object({
    image: z.instanceof(File, { error: "Vui lòng chọn ảnh sản phẩm" }),
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên sản phẩm")
      .max(500, "Tên sản phẩm tối đa 500 ký tự"),
    categoryId: z.number({
      error: "Vui lòng chọn danh mục sản phẩm",
    }),
    originalPrice: z.coerce
      .number({ error: "Vui lòng nhập giá gốc" })
      .positive("Giá gốc phải lớn hơn 0"),
    isDiscount: z.boolean(),
    discountPrice: z.coerce
      .number({ error: "Vui lòng nhập giá khuyến mãi" })
      .positive("Giá khuyến mãi phải lớn hơn 0")
      .optional(),
    stockQuantity: z.coerce
      .number({ error: "Vui lòng nhập số lượng" })
      .int("Số lượng phải là số nguyên")
      .positive("Hàng tồn phải lớn hơn 0"),
  })
  .superRefine((data, ctx) => {
    if (!data.isDiscount) return;

    if (!data.discountPrice || data.discountPrice <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "Vui lòng nhập giá khuyến mãi",
      });
      return;
    }

    if (data.discountPrice >= data.originalPrice) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
      });
    }
  });

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>; // hoặc z.infer, giống nhau
