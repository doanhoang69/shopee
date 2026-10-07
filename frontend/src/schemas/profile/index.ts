import z from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Vui lòng nhập Tên"),
  lastName: z.string().trim().min(1, "Vui lòng nhập Họ"),
  email: z.email("Email không hợp lệ").trim().min(1, "Vui lòng nhập Email"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập Số điện thoại")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số"),
  address: z.string().trim().min(1, "Vui lòng nhập Địa chỉ"),
});

export const sellerprofileSchema = z.object({
  email: z.email("Email không hợp lệ").trim().min(1, "Vui lòng nhập Email"),
  shopName: z.string().trim().min(1, "Vui lòng nhập Tên cửa hàng"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập Số điện thoại")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số"),
  address: z.string().trim().min(1, "Vui lòng nhập Địa chỉ"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SellerProfileFormValues = z.infer<typeof sellerprofileSchema>;
