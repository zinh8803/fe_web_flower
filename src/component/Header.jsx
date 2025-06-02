import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Badge, Button, Box, Typography, InputBase, Paper } from "@mui/material";
import { ShoppingCart, Menu as MenuIcon, Search } from "@mui/icons-material";
import UserMenu from "./UserMenu";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Gán cứng login
    const isLoggedIn = true;
    const userInfo = {
        name: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/40",
    };

    return (
        <Box component="header" width="100%" borderTop={1} borderColor="divider" boxShadow={1}>
            <Box
                maxWidth="lg"
                mx="auto"
                px={4}
                py={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                {/* Logo */}
                <Box display="flex" alignItems="center" gap={2}>
                    <img
                        src="https://shop.dalathasfarm.com/public/dalathasfarm/images/logo.png"
                        alt="Logo"
                        style={{ height: 40 }}
                    />
                </Box>

                {/* Search */}
                <Box flex={1} px={4} maxWidth={500}>
                    <Paper
                        component="form"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            border: "1px solid #16a34a",
                            overflow: "hidden",
                        }}
                        elevation={0}
                    >
                        <InputBase
                            sx={{ ml: 2, flex: 1 }}
                            placeholder="Tìm kiếm"
                            inputProps={{ "aria-label": "search" }}
                        />
                        <IconButton
                            type="button"
                            sx={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                borderRadius: "50%",
                                border: "1px solid #fff",
                                "&:hover": { backgroundColor: "#15803d" },
                                m: 0.5,
                            }}
                            onClick={() => {
                                // Thêm logic tìm kiếm ở đây
                                console.log("Search clicked");
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Paper>
                </Box>

                {/* Right side */}
                <Box display="flex" alignItems="center" gap={3}>
                    {/* Vị trí */}
                    <Box display={{ xs: "none", lg: "flex" }} flexDirection="column" alignItems="center" fontSize="small">
                        <Typography color="text.secondary" fontStyle="italic">Giao đến</Typography>
                        <Typography fontWeight="bold">QUẬN 1</Typography>
                    </Box>

                    {/* Hotline */}
                    <Box display={{ xs: "none", lg: "flex" }} flexDirection="column" alignItems="center" fontSize="small">
                        <Typography fontWeight="bold">1800 1143</Typography>
                        <Typography color="text.secondary" fontStyle="italic">08:00 - 20:00</Typography>
                    </Box>

                    {/* Giỏ hàng */}
                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="warning">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    {/* Đăng nhập / User */}
                    {isLoggedIn ? (
                        <UserMenu user={userInfo} />
                    ) : (
                        <Button color="success" variant="text" size="small">
                            Đăng nhập
                        </Button>
                    )}

                    {/* Mobile menu icon */}
                    <Box display={{ lg: "none" }}>
                        <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;