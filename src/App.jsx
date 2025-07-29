import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { useUserStatusChecker } from "./hooks/useUserStatusChecker";

const App = () => {
    useUserStatusChecker();

    return <AppRoutes />;
};

export default App;
