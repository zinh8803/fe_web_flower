import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdmminRoute = () => {
    const token = useSelector(state => state.user.token);
    const refreshToken = useSelector(state => state.user.refresh_token);
    const isAdmin = useSelector(state => state.user.role);
    if (!token && !refreshToken && isAdmin !== "admin") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AdmminRoute;