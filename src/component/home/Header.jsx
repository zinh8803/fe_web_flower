import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    Menu, MenuItem, IconButton, Badge, Button, Box, Typography, InputBase, Paper, Avatar, Drawer, List, ListItem, ListItemText, Divider, Container
} from "@mui/material";
import { ShoppingCart, Menu as MenuIcon, Search, Close } from "@mui/icons-material";
import UserMenu from "./UserMenu";
import LoginDialog from "../auth/LoginDialog";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const user = useSelector((state) => state.user.user);
    const cartCount = useSelector(state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
    const navigate = useNavigate();

    const handleLoginDialogClose = (shouldReopen = false) => {
        setShowLogin(shouldReopen);
    };

    // Mobile menu content
    const mobileMenu = (
        <Box sx={{ width: 260, p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Link to="/" onClick={() => setMobileOpen(false)}>
                    <img
                        src="https://shop.dalathasfarm.com/public/dalathasfarm/images/logo.png"
                        alt="Logo"
                        style={{ height: 36 }}
                    />
                </Link>
                <IconButton onClick={() => setMobileOpen(false)}>
                    <Close />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem button component={Link} to="/about" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Về chúng tôi" />
                </ListItem>
                <ListItem button component={Link} to="/cart" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Giỏ hàng" />
                </ListItem>
                {user && (
                    <>
                        <ListItem>
                            <ListItemText primary={`Xin chào, ${user.name}`} />
                        </ListItem>
                        <ListItem button component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
                            <ListItemText primary="Thông tin tài khoản" />
                        </ListItem>
                        <ListItem button component={Link} to="/orders/history" onClick={() => setMobileOpen(false)}>
                            <ListItemText primary="Đơn hàng" />
                        </ListItem>
                    </>
                )}
            </List>
            <Divider />
            <Box mt={2}>
                {!user && (
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => {
                            setShowLogin(true);
                            setMobileOpen(false);
                        }}
                    >
                        Đăng nhập
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <Box component="header" width="100%" borderTop={1} borderColor="divider" boxShadow={1} position="sticky" top={0} zIndex={1000} bgcolor="#fff">
            <Container
                maxWidth="xl"
                sx={{
                    px: { xs: 1, sm: 2, md: 4 },
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                {/* Logo */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Link to="/">
                        <img
                            src="https://shop.dalathasfarm.com/public/dalathasfarm/images/logo.png"
                            alt="Logo"
                            style={{ height: 38 }}
                        />
                    </Link>
                </Box>

                {/* Search - Ẩn trên xs, hiện từ sm trở lên */}
                <Box flex={1} px={{ xs: 1, md: 4 }} maxWidth={500} display={{ xs: "none", sm: "block" }}>
                    <Paper
                        component="form"
                        onSubmit={e => {
                            e.preventDefault();
                            if (searchValue.trim()) {
                                navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                            }
                        }}
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
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                        <IconButton
                            type="submit"
                            sx={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                borderRadius: "50%",
                                border: "1px solid #fff",
                                "&:hover": { backgroundColor: "#15803d" },
                                m: 0.5,
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Paper>
                </Box>

                {/* Right side */}
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2, md: 3 }}>
                    {/* Hotline */}
                    <Box display={{ xs: "none", md: "flex" }} flexDirection="column" alignItems="center" fontSize="small">
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
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            >
                                Xin chào, {user.name}
                            </Typography>
                            <Box display={{ xs: "none", sm: "block" }}>
                                <UserMenu
                                    user={{
                                        name: user.name,
                                        image_url: user.image_url
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Button
                            color="success"
                            variant="contained"
                            size="small"
                            sx={{ display: { xs: "none", sm: "block" } }}
                            onClick={() => setShowLogin(true)}
                        >
                            Đăng nhập
                        </Button>
                    )}

                    {/* Mobile menu icon */}
                    <Box display={{ sm: "none" }}>
                        <IconButton onClick={() => setMobileOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>

            {/* Search riêng cho mobile */}
            <Box display={{ xs: "block", sm: "none" }} px={2} pb={1}>
                <Paper
                    component="form"
                    onSubmit={e => {
                        e.preventDefault();
                        if (searchValue.trim()) {
                            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                        }
                    }}
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
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                    <IconButton
                        type="submit"
                        sx={{
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            borderRadius: "50%",
                            border: "1px solid #fff",
                            "&:hover": { backgroundColor: "#15803d" },
                            m: 0.5,
                        }}
                    >
                        <Search />
                    </IconButton>
                </Paper>
            </Box>

            {/* Drawer cho mobile */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
            >
                {mobileMenu}
            </Drawer>
            <LoginDialog open={showLogin} onClose={handleLoginDialogClose} />
        </Box>
    );
};

export default Header;