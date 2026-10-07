import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyShopProductsQuery } from "@/services/product";
import AddProductDialog from "./AddProductDialog";
import ProductItem, { ProductItemSkeleton } from "@/pages/home/ProductItem";

const MyShopPage = () => {
  const { user } = useAuth();
  if (!user) {
    return <LoadingScreen />;
  }

  const {
    data,
    isFetching: isLoadingProducts,
    isError,
  } = useGetMyShopProductsQuery({
    page: 1,
    sellerId: user.id,
  });
  const productList = data?.data || [];

  if (isLoadingProducts) {
    return (
      <div className="flex-1 pt-5 grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 pt-10 text-center text-gray-500">
        Có lỗi xảy ra khi tải sản phẩm
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium">Cửa Hàng Của Tôi</p>
        <AddProductDialog />
      </div>

      {productList.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Chưa có mặt hàng nào
        </div>
      ) : (
        <div className="pt-5 grid grid-cols-5 grid-rows-4 justify-between gap-3">
          {productList.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyShopPage;
