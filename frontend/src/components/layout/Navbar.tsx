import Logo from "../common/Logo";
import { Search, Globe, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useGetCartItemCountQuery } from "@/services/cartApi";
import { useLogoutMutation } from "@/services/authApi";
import { toast } from "sonner";
import UserAvatar from "../common/UserAvatar";
import NotificationCount from "../common/NotificationCount";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { rootApi } from "@/services/baseApi";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user: userInfo } = useAuth();
  const { data: cartItemCount, isLoading } = useGetCartItemCountQuery();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [searchVal, setSearchVal] = useState<string>("");

  const handleSearchProducts = () => {
    const trimmedSearch = searchVal.trim();
    if (!trimmedSearch) return;
    navigate(`/products?search=${trimmedSearch}`);
  };

  const handleLogout = async () => {
    const { success } = await logout().unwrap();
    if (!success) {
      toast.error("Đã có lỗi xảy ra");
    }
    dispatch(rootApi.util.resetApiState());
  };

  if (!userInfo) {
    return null;
  }

  return (
    <nav className="bg-linear-to-b from-[#f53d2d] to-[#ff6633] py-2 fixed top-0 w-full z-10">
      <div className="max-w-300 mx-auto">
        <div className="flex items-center justify-end gap-6 h-9 text-white text-sm">
          <NotificationCount />

          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>Tiếng Việt</span>
          </div>

          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <UserAvatar src={userInfo.avatarKey} />
                {userInfo.role === "CUSTOMER" && (
                  <p>
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                )}
                {userInfo.role === "SELLER" && <p>{userInfo.shopName}</p>}
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-40 px-0 flex flex-col items-start gap-0 bg-white text-black *:px-3 *:py-2 *:w-full *:hover:bg-gray-50 *:hover:text-primary *:cursor-pointer text-sm">
              <Link
                to={`${userInfo.role === "CUSTOMER" ? "/account/profile" : "/seller/account/profile"}`}
              >
                Tài Khoản
              </Link>
              {userInfo.role === "SELLER" && (
                <Link to="/seller/account/shop">Cửa hàng của tôi</Link>
              )}
              <Link
                to={`${userInfo.role === "CUSTOMER" ? "/account/orders" : "/seller/account/orders"}`}
              >
                Đơn mua
              </Link>
              <Button
                variant="ghost"
                className="justify-start font-normal"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                Đăng Xuất
              </Button>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex justify-between items-center">
          <Logo className="text-white" />

          <form
            className="flex-1 max-w-210 flex bg-white h-10 p-0.75 rounded-xs"
            onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSearchProducts();
            }}
          >
            <input
              type="text"
              value={searchVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchVal(e.target.value)
              }
              placeholder="Tìm kiếm sản phẩm"
              className="block flex-1 h-full px-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <Button className="w-15 h-full rounded-xs" disabled={!searchVal}>
              <Search className="size-5 text-white" />
            </Button>
          </form>

          {userInfo?.role === "CUSTOMER" && (
            <Link
              to="/cart"
              className="relative text-white shrink-0 cursor-pointer"
            >
              <ShoppingCart className="size-7" />
              {!isLoading && (
                <span className="bg-white absolute -top-2 -right-2 flex items-center justify-center text-primary text-xs font-semibold rounded-full size-5">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
