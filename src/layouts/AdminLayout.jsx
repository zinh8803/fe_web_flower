import React, { useState } from "react";
import { Box, Drawer, Toolbar, AppBar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminMenu from "../component/admin/AdminMenu";
import { Outlet } from "react-router-dom";

const drawerWidth = 260;

const AdminLayout = () => {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
                    ml: open ? `${drawerWidth}px` : 0,
                    bgcolor: "#fff",
                    color: "#222",
                    boxShadow: "none",
                    borderBottom: "1px solid #e0e0e0",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700} color="green" noWrap>
                        ADMIN PANEL
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                sx={{
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: (theme) =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "#f5f5f5",
                        borderRight: "1px solid #e0e0e0",
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        overflowX: 'hidden',
                        overflowY: 'visible', // ← Thêm dòng này
                        // hoặc chỉ cần: overflow: 'visible',
                        ...(open && {
                            width: drawerWidth,
                        }),
                        ...(!open && {
                            width: 0,
                        }),
                    },
                }}
                variant="permanent"
                open={open}
            >
                {open && <AdminMenu />}
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "#fafafa",
                    p: 3,
                    width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
                    transition: (theme) =>
                        theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;