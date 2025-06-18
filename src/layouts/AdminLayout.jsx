import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { Inventory, Category, ShoppingCart, People } from "@mui/icons-material";
import { Link, Outlet, useLocation } from "react-router-dom";

const menuItems = [
    { text: "Quản lý sản phẩm", icon: <Inventory />, path: "/admin/products" },
    { text: "Quản lý danh mục", icon: <Category />, path: "/admin/categories" },
    { text: "Quản lý đơn hàng", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Quản lý người dùng", icon: <People />, path: "/admin/users" },
];

const drawerWidth = 220;

const AdminLayout = () => {
    const location = useLocation();

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "#f5f5f5",
                        borderRight: "1px solid #e0e0e0"
                    },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" fontWeight={700} color="green">
                        ADMIN PANEL
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map(item => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={location.pathname.startsWith(item.path)}
                        >
                            <ListItemIcon sx={{ color: "green" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {/* AppBar */}
            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: "#fafafa", p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;