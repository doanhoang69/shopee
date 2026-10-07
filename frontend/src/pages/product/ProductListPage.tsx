import { useSearchParams } from "react-router-dom";
import { useGetAllProductsQuery } from "@/services/product";
import CategoryList from "../home/Categories";
import ProductItem, { ProductItemSkeleton } from "../home/ProductItem";
import type { GetAllProductsParams } from "@/services/product";
import { Info } from "lucide-react";

const ProductListPage = () => {
  const [searchParams] = useSearchParams();

  const queryParams: GetAllProductsParams = {
    page: Number(searchParams.get("page")) || 1,
    categoryId: searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined,
    search: searchParams.get("search") || undefined,
    sortBy:
      (searchParams.get("sortBy") as GetAllProductsParams["sortBy"]) ||
      undefined,
    order:
      (searchParams.get("order") as GetAllProductsParams["order"]) || undefined,
  };

  const {
    data,
    isFetching: isLoadingProducts,
    isError,
  } = useGetAllProductsQuery(queryParams);

  const productList = data ? data.data : [];

  return (
    <div className="flex gap-3">
      <CategoryList layout="vertical" className="shrink-0 h-fit" />

      <div className="flex-1">
        {isLoadingProducts ? (
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductItemSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-75 text-gray-500 text-sm">
            Đã có lỗi xảy ra, vui lòng thử lại sau.
          </div>
        ) : productList.length === 0 ? (
          <div className="flex items-center justify-center h-75 text-gray-500 text-sm">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div>
            {queryParams.search && (
              <p className="flex items-center gap-2 text-gray-700">
                <Info /> Kết quả tìm kiếm cho từ khoá
                <span className="text-primary italic">
                  '{queryParams.search}'
                </span>
              </p>
            )}

            <div className="py-5 grid grid-cols-5 gap-3">
              {productList.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
