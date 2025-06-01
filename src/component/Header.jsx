import React from "react";
import { InputBase, Badge, IconButton } from "@mui/material";
import { Search, ShoppingCart, Phone, LocationOn } from "@mui/icons-material";

const Header = () => {
    return (
        <header className="w-full border-t border-green-600 flex items-center justify-between px-4 py-2">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <img
                    src="https://shop.dalathasfarm.com/public/dalathasfarm/images/logo.png"
                    alt="Dalat Hasfarm"
                    className="h-10 object-contain"
                />
                <span className="text-sm text-gray-500">Flower your life</span>
            </div>

            {/* Search Box */}
            <div className="flex-1 max-w-[500px] mx-4">
                <div className="flex items-center border border-green-600 rounded-full overflow-hidden">
                    <InputBase
                        placeholder="Tìm kiếm"
                        className="px-4 py-1 w-full"
                        sx={{ fontSize: 14 }}
                    />
                    <IconButton
                        type="submit"
                        sx={{
                            backgroundColor: "#008437",
                            color: "#fff",
                            borderRadius: "0 9999px 9999px 0",
                            padding: "8px",
                            "&:hover": { backgroundColor: "#006f2f" },
                        }}
                    >
                        <Search />
                    </IconButton>
                </div>
            </div>

            {/* Địa chỉ + Liên hệ + Giỏ hàng */}
            <div className="flex items-center space-x-6">
                {/* Địa chỉ */}
                <div className="flex items-center space-x-1 text-sm">
                    <LocationOn fontSize="small" />
                    <div>
                        <div className="text-gray-500">Giao đến</div>
                        <div className="font-semibold text-black">QUẬN 1</div>
                    </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center space-x-1 text-sm">
                    <Phone fontSize="small" />
                    <div>
                        <div className="font-bold text-black">1800 1143</div>
                        <div className="text-gray-500 text-xs">từ 08:00 - 20:00</div>
                    </div>
                </div>

                {/* Giỏ hàng */}
                <IconButton>
                    <Badge badgeContent={0} color="warning">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
            </div>
        </header>
    );
};

export default Header;
