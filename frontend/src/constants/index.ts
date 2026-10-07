export type OrderStatus =
  | "ORDERED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED";

export const CATEGORIES = [
  {
    key: 1,
    label: "Thời trang",
    imageKey: "/thời trang.webp",
  },
  {
    key: 2,
    label: "Đồ điện tử",
    imageKey: "/đồ điện tử.webp",
  },
  {
    key: 3,
    label: "Mỹ phẩm",
    imageKey: "/mỹ phẩm.webp",
  },
  {
    key: 4,
    label: "Thể thao",
    imageKey: "/thể thao.webp",
  },
  {
    key: 5,
    label: "Đồ chơi",
    imageKey: "/đồ chơi.webp",
  },
  {
    key: 6,
    label: "Đồ gia dụng",
    imageKey: "/đồ gia dụng.webp",
  },
  {
    key: 7,
    label: "Đồ trang trí",
    imageKey: "/đồ trang trí.webp",
  },
  {
    key: 8,
    label: "Phụ kiện",
    imageKey: "/phụ kiện.webp",
  },
];

export const SHIPPING_COST = 30000;

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024; // 1MB
export const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
