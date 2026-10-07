import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils";
import CoinIcon from "/coin.png";
import ListIcon from "/list.png";
import UserIcon from "/user.png";
import ShopIcon from "/shop.png";
import VoucherIcon from "/voucher.png";
import { useAuth } from "@/hooks/useAuth";

interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  alt: string;
}

const sidebarItems: SidebarItem[] = [
  {
    key: "profile",
    label: "Hồ sơ",
    icon: UserIcon,
    path: "/account/profile",
    alt: "user_icon",
  },
  {
    key: "shop",
    label: "Cửa hàng của tôi",
    icon: ShopIcon,
    path: "/account/shop",
    alt: "shop_icon",
  },
  {
    key: "orders",
    label: "Đơn Mua",
    icon: ListIcon,
    path: "/account/orders",
    alt: "list_icon",
  },
  {
    key: "vouchers",
    label: "Kho Voucher",
    icon: VoucherIcon,
    path: "/vouchers",
    alt: "voucher_icon",
  },
  {
    key: "shopee-xu",
    label: "Shopee Xu",
    icon: CoinIcon,
    path: "/shopee-xu",
    alt: "coin_icon",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isSeller = user?.role === "SELLER";

  const visibleItems = sidebarItems.filter(
    (item) => item.key !== "shop" || isSeller,
  );

  return (
    <div className="shrink-0 flex flex-col gap-4">
      {visibleItems.map(({ key, label, icon, path, alt }) => {
        const isActive = location.pathname.includes(key);

        return (
          <Link
            key={key}
            to={isSeller ? `/seller/${path}` : path}
            className="flex items-center gap-2 text-sm hover:text-orange-500"
          >
            <img src={icon} alt={alt} className="size-5" />
            <span className={cn(isActive && "text-primary")}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
