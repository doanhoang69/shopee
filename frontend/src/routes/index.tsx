import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import HomePage from "@/pages/home/HomePage";
import NotFountPage from "@/pages/NotFountPage";
import ProductListPage from "@/pages/product/ProductListPage";
import ProductDetailPage from "@/pages/product/ProductDetailPage";
import MyAccount from "@/pages/account/customer/MyAccount";
import ProfilePage from "@/pages/account/customer/ProfilePage";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import CartPage from "@/pages/cart/CartPage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import MyOrdersPage from "@/pages/account/customer/MyOrdersPage";
import UnauthorizedPage from "@/pages/403Page";
import ShopOrdersPage from "@/pages/account/seller/ShopOrdersPage";
import ShopProfilePage from "@/pages/account/seller/ShopProfilePage";
import MyShopPage from "@/pages/account/seller/MyShopPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER", "SELLER"]} />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "products",
            element: <ProductListPage />,
          },
          {
            path: "products/:productId",
            element: <ProductDetailPage />,
          },
          {
            path: "account",
            element: <MyAccount />,
            children: [
              {
                index: true,
                element: <Navigate to="profile" replace />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
              {
                path: "orders",
                element: <MyOrdersPage />,
              },
            ],
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
        ],
      },
    ],
  },
  {
    // Nhóm route chỉ dành cho Seller
    path: "/seller",
    element: <ProtectedRoute allowedRoles={["SELLER"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="account/profile" replace />,
          },
          {
            path: "account",
            element: <MyAccount />,
            children: [
              {
                index: true,
                element: <Navigate to="profile" replace />,
              },
              {
                path: "profile",
                element: <ShopProfilePage />,
              },
              {
                path: "shop",
                element: <MyShopPage />,
              },
              {
                path: "orders",
                element: <ShopOrdersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/403",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFountPage />,
  },
]);
