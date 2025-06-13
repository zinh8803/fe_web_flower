import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Menu, MenuItem, IconButton, Badge, Button, Box, Typography, InputBase, Paper } from "@mui/material";
import { ShoppingCart, Menu as MenuIcon, Search } from "@mui/icons-material";
import UserMenu from "./UserMenu";
import LoginDialog from "../auth/LoginDialog";
import { Link } from "react-router-dom";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const user = useSelector((state) => state.user.user);
    const cartCount = useSelector(state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));

    const handleLoginDialogClose = (shouldReopen = false) => {
        setShowLogin(shouldReopen);
    };

    return (
        <Box component="header" width="100%" borderTop={1} borderColor="divider" boxShadow={1} position="sticky" top={0} zIndex={1000} bgcolor="#fff">
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
                    <Link to="/"><img
                        src="https://shop.dalathasfarm.com/public/dalathasfarm/images/logo.png"
                        alt="Logo"
                        style={{ height: 40 }}
                    /></Link>
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


                    {/* Hotline */}
                    <Box display={{ xs: "none", lg: "flex" }} flexDirection="column" alignItems="center" fontSize="small">
                        <Link to="/about"
                            style={{ textDecoration: "none", color: "#16a34a", fontWeight: "bold" }}
                        >Về chúng tôi</Link>
                    </Box>

                    {/* Giỏ hàng */}
                    <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <IconButton color="inherit">
                            <Badge badgeContent={cartCount} color="warning">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Link>

                    {/* Đăng nhập / User */}
                    {user ? (
                        <UserMenu
                            user={{
                                name: user.name,
                                avatar: user.avatar_url || "https://i.pravatar.cc/40"
                            }}
                        />
                    ) : (
                        <Button color="success" variant="contained" size="small"
                            onClick={() => setShowLogin(true)}
                        >
                            Đăng nhập
                        </Button>
                    )}

                    {/* Mobile menu icon */}
                    <Box display={{ lg: "none" }}>
                        <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <LoginDialog open={showLogin} onClose={handleLoginDialogClose} />
                </Box>
            </Box>
        </Box>
    );
};

export default Header;