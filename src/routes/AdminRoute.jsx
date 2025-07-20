import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const allowedEmployeePaths = [
    "/admin/dashboard",
    "/admin/orders",
    "/admin/receipts",
    "/admin/profileAdmin",
    "/admin/change-password",
];

const AdminRoute = () => {
    const user = useSelector(state => state.user.user);
    const location = useLocation();

    if (!user || (user.role !== "admin" && user.role !== "employee")) {
        return <Navigate to="/" replace />;
    }

    if (
        user.role === "employee" &&
        !allowedEmployeePaths.some(path => location.pathname.startsWith(path))
    ) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;