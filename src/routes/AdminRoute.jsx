import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const user = useSelector(state => state.user.user);

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AdminRoute;