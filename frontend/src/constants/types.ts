export const UserRole = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  SHIPPER: "SHIPPER",
} as const;

export const NotificationType = {
  NEW_ORDER: "NEW_ORDER",
  SELLER_CONFIRMED: "SELLER_CONFIRMED",
  ORDER_SHIPPING: "ORDER_SHIPPING",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}

export interface CommonResponse {
  success: boolean;
  message: string;
}
