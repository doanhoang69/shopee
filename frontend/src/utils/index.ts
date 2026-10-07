import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | null): string => {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count);
  }

  const k = Math.floor(count / 1000);
  return `${k}k+`;
}

const MONTHS_VI = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export function getEstimatedDeliveryRange(): string {
  const today = new Date();

  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() + 2);

  const toDate = new Date(today);
  toDate.setDate(today.getDate() + 3);

  const formatDay = (date: Date) =>
    `${date.getDate()} Thg ${MONTHS_VI[date.getMonth()]}`;

  return `${formatDay(fromDate)} - ${formatDay(toDate)}`;
}
