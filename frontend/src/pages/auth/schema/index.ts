import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ").trim().min(1, "Vui lòng nhập email"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
