import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/User/Home";
import About from "../pages/User/About";
import NotFound from "../pages/User/NotFound";
import MainLayout from "../layouts/MainLayout";
import Cart from "../component/Cart/Cart";
import ProductDetail from "../pages/User/ProductDetail";
import Checkout from "../pages/User/Checkout";
import CategoryProductDetail from "../pages/User/Category_product_detail";
import OrderDetail from "../pages/User/OrderDetail";
import OrderHistory from "../pages/User/OrderHistory";
import Profile from "../pages/User/Profile";
import ProductSearch from "../pages/User/ProductSearch";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminProduct from "../pages/Admin/AdminProduct";
import AdminCategory from "../pages/Admin/AdminCategory";
import AdminOrder from "../pages/Admin/AdminOrder";
import AdminUser from "../pages/Admin/AdminUser";
import Admin from "../pages/Admin/Admin";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminReceipt from "../pages/Admin/AdminReceipt";
import AdminDiscount from "../pages/Admin/AdminDiscount";
import AdminFlowerType from "../pages/Admin/AdminFlowerType";
import AdminFlower from "../pages/Admin/AdminFlower";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import VnpayReturn from "../pages/User/VnaypayReturn";
import AdminRoute from "./AdminRoute";
import StockProductAdmin from "../pages/Admin/StockProductAdmin";
import ChangePassWordPage from "../pages/User/ChangePassWordPage";
import ResetPassWordPage from "../pages/User/ResetPassWordPage";
import ScrollToTop from "../component/ScrollToTop";
import AdminEmployee from "../pages/Admin/AdminEmployee";
import ProfileAdmin from "../pages/Admin/ProfileAdmin";
import ChangePasswordAdminPage from "../pages/Admin/ChangePasswordAdminPage";
import AdminSubscribers from "../pages/Admin/AdminSubcribers";
import AdminTrashProducts from "../pages/Admin/AdminTrashProducts";
import AdminColors from "../pages/Admin/AdminColors";
import AdminMessage from "../pages/Admin/AdminMessage";

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Main layout cho user */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:id" element={<CategoryProductDetail />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password" element={<ResetPassWordPage />} />
        <Route path="/vnpay_return" element={<VnpayReturn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/orders/history" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassWordPage />} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="products/stock" element={<StockProductAdmin />} />
          <Route path="products/trash" element={<AdminTrashProducts />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="categories" element={<AdminCategory />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="discounts/subscribers" element={<AdminSubscribers />} />
          <Route path="employees" element={<AdminEmployee />} />
          <Route path="flowers" element={<AdminFlower />} />
          <Route path="flower-types" element={<AdminFlowerType />} />
          <Route path="flower-types/colors" element={<AdminColors />} />
          <Route path="discounts" element={<AdminDiscount />} />
          <Route path="receipts" element={<AdminReceipt />} />
          <Route path="messages" element={<AdminMessage />} />
          <Route path="profileAdmin" element={<ProfileAdmin />} />
          <Route path="change-password" element={<ChangePasswordAdminPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
    <ScrollToTop />
  </>
);

export default AppRoutes;
