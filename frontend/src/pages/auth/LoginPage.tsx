import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./schema";
import { useLoginMutation } from "@/services/authApi";
import { useState } from "react";
import Logo from "@/components/common/Logo";
import { UserRole } from "@/constants/types";

const roleOptions = [
  { label: "Người mua", value: UserRole.CUSTOMER },
  { label: "Người bán", value: UserRole.SELLER },
  { label: "Shipper", value: UserRole.SHIPPER },
];

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();

      navigate("/", {
        replace: true,
      });
    } catch (err: any) {
      setError("password", {
        message: err.data.message,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white h-21 flex items-center">
        <Logo className="text-primary" />
      </div>

      <div className="grow bg-primary flex items-center justify-center">
        <div className="bg-white w-full max-w-md border border-orange-500 rounded-md p-8">
          <h1 className="text-2xl text-center font-medium text-gray-800 mb-6">
            Đăng nhập
          </h1>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <input
                type="text"
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-3 text-sm outline-none focus:border-orange-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full border border-gray-300 rounded px-3 py-3 text-sm outline-none focus:border-orange-500"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="h-11">
              Đăng nhập
            </Button>
          </form>

          <div className="mt-4 text-sm">
            <p className="text-blue-600 hover:underline cursor-pointer">
              Quên mật khẩu
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {roleOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                onClick={() => setRole(option.value)}
                className={`flex-1 duration-100 ${
                  role === option.value
                    ? "bg-primary text-white border-primary hover:bg-primary hover:text-white"
                    : "hover:bg-primary hover:text-white"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <span className="text-orange-500 hover:underline">
              Điều khoản dịch vụ
            </span>{" "}
            &{" "}
            <span className="text-orange-500 hover:underline">
              Chính sách bảo mật
            </span>{" "}
            của Shopee
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Bạn mới biết đến Shopee?{" "}
            <Link
              to="/register"
              className="text-orange-500 font-medium hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
