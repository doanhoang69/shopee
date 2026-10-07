import z from "zod";

export const reviewProductSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 1 * 1024 * 1024, "Ảnh tối đa 1MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Chỉ chấp nhận file JPEG, PNG hoặc WebP",
    )
    .optional(),
  content: z
    .string()
    .trim()
    .max(500, "Tên sản phẩm tối đa 500 ký tự")
    .optional(),
  rating: z
    .number({ error: "Vui lòng chọn số sao đánh giá" })
    .int("Số sao phải là số nguyên")
    .min(1, "Số sao tối thiểu là 1")
    .max(5, "Số sao tối đa là 5"),
});

export type ReviewProductFormInput = z.input<typeof reviewProductSchema>;
export type ReviewProductFormValues = z.output<typeof reviewProductSchema>; // hoặc z.infer, giống nhau
