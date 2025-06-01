import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const Header = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    return (
        <header className="p-4 shadow bg-white flex justify-between">
            <h1 className="text-xl font-bold">Flower Shop</h1>
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">Xin chào, {user.name}</span>
                    <button
                        onClick={() => dispatch(logout())}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                        Đăng xuất
                    </button>
                </div>
            ) : (
                <a href="/login" className="text-blue-500">Đăng nhập</a>
            )}
        </header>
    );
};

export default Header;
