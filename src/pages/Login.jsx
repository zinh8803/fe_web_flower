import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const Login = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        const fakeUser = { id: 1, name: "Nguyễn Văn A" };
        const fakeToken = "fake-token-123";
        dispatch(setUser({ user: fakeUser, token: fakeToken }));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
            <button className="bg-blue-600 text-white px-4 py-2" onClick={handleLogin}>
                Đăng nhập
            </button>
        </div>
    );
};

export default Login;
