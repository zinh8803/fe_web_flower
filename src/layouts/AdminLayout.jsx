import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import { Inventory, Category, ShoppingCart, People } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";
import AdminMenu from "../component/admin/AdminMenu";


const drawerWidth = 220;

const AdminLayout = () => {

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
                <AdminMenu />
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