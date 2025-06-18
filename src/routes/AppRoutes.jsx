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

const AppRoutes = () => (
    <Router>
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
                <Route element={<PrivateRoute />}>
                    <Route path="/orders/history" element={<OrderHistory />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Admin layout */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route element={<Admin />}>
                    <Route path="products" element={<AdminProduct />} />
                    <Route path="categories" element={<AdminCategory />} />
                    <Route path="orders" element={<AdminOrder />} />
                    <Route path="users" element={<AdminUser />} />
                </Route>
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
