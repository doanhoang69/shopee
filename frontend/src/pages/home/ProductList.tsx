import { useGetAllProductsQuery } from "@/services/product";
import ProductItem, { ProductItemSkeleton } from "./ProductItem";

const ProductList = () => {
  const {
    data,
    isFetching: isLoadingProducts,
    isError,
  } = useGetAllProductsQuery({
    page: 1,
  });

  const productList = data ? data.data : [];

  if (isLoadingProducts) {
    return (
      <div className="pt-5 grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <ProductItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-10 text-center text-gray-500">
        Có lỗi xảy ra khi tải sản phẩm
      </div>
    );
  }

  return (
    <div className="pt-5 grid grid-cols-5 grid-rows-4 justify-between gap-3">
      {productList.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
