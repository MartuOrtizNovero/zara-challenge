import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import CartPage from "../../pages/cart/CartPage.jsx";
import CatalogPage from "../../pages/catalog/CatalogPage.jsx";
import ProductDetailPage from "../../pages/product-detail/ProductDetailPage.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CatalogPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
