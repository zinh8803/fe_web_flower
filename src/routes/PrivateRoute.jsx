import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = useSelector(state => state.user.token);
    const refreshToken = useSelector(state => state.user.refresh_token);

    if (!token && !refreshToken) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default PrivateRoute;