import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    IconButton, Badge, Button, Box, Typography, InputBase, Paper, Drawer, List, ListItem, ListItemText, Divider, Container
} from "@mui/material";
import { ShoppingCart, Menu as MenuIcon, Search, Close, Info } from "@mui/icons-material";
import UserMenu from "./UserMenu";
import LoginDialog from "../auth/LoginDialog";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/LOGO_HOA.png";
import { logoutAndClearCart } from "../../store/userSlice";
import { showNotification } from "../../store/notificationSlice";

const Header = () => {
    const dispatch = useDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const user = useSelector((state) => state.user.user);
    const cartCount = useSelector(state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
    const navigate = useNavigate();

    const handleLoginDialogClose = (shouldReopen = false) => {
        setShowLogin(shouldReopen);
    };

    const handleLogout = () => {
        dispatch(logoutAndClearCart());
        navigate("/");
        dispatch(showNotification({
            message: "Đăng xuất thành công!",
            severity: "success"
        }));
    };

    // Mobile menu drawer
    const mobileMenu = (
        <Box sx={{ width: 280, p: 2.5 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Link to="/" onClick={() => setMobileOpen(false)}>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{ height: 38, width: "auto" }}
                    />
                </Link>
                <IconButton onClick={() => setMobileOpen(false)}>
                    <Close />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
                <ListItem
                    component={Link}
                    to="/about"
                    onClick={() => setMobileOpen(false)}
                    sx={{ borderRadius: "8px", mb: 1, "&:hover": { bgcolor: "rgba(22, 163, 74, 0.08)" } }}
                >
                    <ListItemText primary="Về chúng tôi" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>

                {user ? (
                    <>
                        <Box sx={{ p: 1.5, bgcolor: "rgba(22, 163, 74, 0.06)", borderRadius: "8px", mb: 1 }}>
                            <Typography variant="subtitle2" color="#16a34a" fontWeight={700}>
                                Xin chào, {user.name}
                            </Typography>
                        </Box>
                        <ListItem
                            component={Link}
                            to="/profile"
                            onClick={() => setMobileOpen(false)}
                            sx={{ borderRadius: "8px", mb: 0.5 }}
                        >
                            <ListItemText primary="Thông tin tài khoản" />
                        </ListItem>
                        <ListItem
                            component={Link}
                            to="/change-password"
                            onClick={() => setMobileOpen(false)}
                            sx={{ borderRadius: "8px", mb: 0.5 }}
                        >
                            <ListItemText primary="Đổi mật khẩu" />
                        </ListItem>
                        <ListItem
                            component={Link}
                            to="/orders/history"
                            onClick={() => setMobileOpen(false)}
                            sx={{ borderRadius: "8px", mb: 0.5 }}
                        >
                            <ListItemText primary="Đơn hàng" />
                        </ListItem>
                        <ListItem
                            onClick={() => {
                                setMobileOpen(false);
                                handleLogout();
                            }}
                            sx={{ borderRadius: "8px", color: "error.main", cursor: "pointer" }}
                        >
                            <ListItemText primary="Đăng xuất" />
                        </ListItem>
                    </>
                ) : (
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, py: 1.2 }}
                            onClick={() => {
                                setShowLogin(true);
                                setMobileOpen(false);
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                )}
            </List>
        </Box>
    );

    return (
        <Box
            component="header"
            sx={{
                width: "100%",
                position: "sticky",
                top: 0,
                zIndex: 1100,
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
                transition: "all 0.3s ease"
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                    py: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                {/* Logo */}
                <Box display="flex" alignItems="center">
                    <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={Logo}
                            alt="Flower Shop Logo"
                            style={{
                                height: 42,
                                width: "auto",
                                transition: "transform 0.2s ease"
                            }}
                        />
                    </Link>
                </Box>

                {/* Search Bar - Desktop */}
                <Box flex={1} px={{ xs: 1, md: 4 }} maxWidth={550} display={{ xs: "none", sm: "block" }}>
                    <Paper
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchValue.trim()) {
                                navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                            }
                        }}
                        elevation={0}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "999px",
                            border: `1.5px solid ${isSearchFocused ? "#16a34a" : "#cbd5e1"}`,
                            boxShadow: isSearchFocused ? "0 0 0 4px rgba(22, 163, 74, 0.12)" : "none",
                            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            bgcolor: "#f8fafc",
                            px: 1,
                            py: 0.3
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1.5, flex: 1, fontSize: "0.95rem" }}
                            placeholder="Tìm hoa tươi, quà tặng..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <IconButton
                            type="submit"
                            aria-label="search"
                            sx={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                width: 36,
                                height: 36,
                                "&:hover": { backgroundColor: "#15803d", transform: "scale(1.05)" },
                                transition: "all 0.2s ease",
                                m: 0.3
                            }}
                        >
                            <Search sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Paper>
                </Box>

                {/* Right Navigation Controls */}
                <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2, md: 2.5 }}>
                    {/* Navigation Link */}
                    <Box display={{ xs: "none", md: "flex" }} alignItems="center">
                        <Link
                            to="/about"
                            style={{
                                textDecoration: "none",
                                color: "#334155",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Info sx={{ fontSize: 18, color: "#16a34a" }} />
                            Về chúng tôi
                        </Link>
                    </Box>

                    {/* Cart Icon with badge */}
                    <Link to="/cart" style={{ textDecoration: "none" }}>
                        <IconButton
                            sx={{
                                color: "#334155",
                                p: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    bgcolor: "rgba(22, 163, 74, 0.08)",
                                    color: "#16a34a",
                                    transform: "scale(1.08)"
                                }
                            }}
                        >
                            <Badge
                                badgeContent={cartCount}
                                color="error"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        fontWeight: 700,
                                        boxShadow: "0 0 0 2px #fff",
                                        animation: cartCount > 0 ? "badgeBounce 0.4s ease" : "none"
                                    }
                                }}
                            >
                                <ShoppingCart sx={{ fontSize: 24 }} />
                            </Badge>
                        </IconButton>
                    </Link>

                    {/* User Auth Info */}
                    {user ? (
                        <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap={1}>
                            <UserMenu
                                user={{
                                    name: user.name,
                                    image_url: user.image_url
                                }}
                            />
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            size="medium"
                            disableElevation
                            sx={{
                                display: { xs: "none", sm: "inline-flex" },
                                borderRadius: "999px",
                                px: 2.5,
                                fontWeight: 700,
                                textTransform: "none",
                                bgcolor: "#16a34a",
                                "&:hover": { bgcolor: "#15803d", boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)" }
                            }}
                            onClick={() => setShowLogin(true)}
                        >
                            Đăng nhập
                        </Button>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <Box display={{ sm: "none" }}>
                        <IconButton onClick={() => setMobileOpen(true)} color="inherit">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>

            {/* Mobile Search Bar */}
            <Box display={{ xs: "block", sm: "none" }} px={2} pb={1.5}>
                <Paper
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (searchValue.trim()) {
                            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                        }
                    }}
                    elevation={0}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "999px",
                        border: "1px solid #16a34a",
                        bgcolor: "#f8fafc",
                        px: 1,
                        py: 0.2
                    }}
                >
                    <InputBase
                        sx={{ ml: 1.5, flex: 1, fontSize: "0.9rem" }}
                        placeholder="Tìm hoa tươi..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <IconButton
                        type="submit"
                        sx={{
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            width: 32,
                            height: 32,
                            "&:hover": { backgroundColor: "#15803d" },
                            m: 0.3
                        }}
                    >
                        <Search sx={{ fontSize: 18 }} />
                    </IconButton>
                </Paper>
            </Box>

            {/* Mobile Drawer */}
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