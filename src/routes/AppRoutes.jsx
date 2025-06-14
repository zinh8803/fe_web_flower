import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/User/Home";
import About from "../pages/User/About";
import NotFound from "../pages/User/NotFound";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/User/Login";
import Cart from "../component/Cart/Cart";
import ProductDetail from "../pages/User/ProductDetail";
import Checkout from "../pages/User/Checkout";
import CategoryProductDetail from "../pages/User/Category_product_detail";

const AppRoutes = () => (
    <Router>
        <MainLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/detail/:id" element={<ProductDetail />} />
                <Route path="/category/:id" element={<CategoryProductDetail />} />
            </Routes>
        </MainLayout>
    </Router>
);

export default AppRoutes;
