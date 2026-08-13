import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { useUserStatusChecker } from "./hooks/useUserStatusChecker";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "./store/cartSlice";

const App = () => {
    useUserStatusChecker();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.user?.id || null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch, userId]);

    return <AppRoutes />;
};

export default App;
