import React from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import { getNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications } from "../../services/notifycationService";

const Notifycation = ({
    notifications,
    unread,
    anchorEl,
    onBellClick,
    onClose,
    setNotifications,
    setUnread,
}) => {
    const handleDelete = async (id) => {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnread((prev) => Math.max(0, prev - 1));
    };

    const handleDeleteAll = async () => {
        await deleteAllNotifications();
        setNotifications([]);
        setUnread(0);
    };

    const handleMenuOpen = async (event) => {
        onBellClick(event);

        const unreadNotifications = notifications.filter(n => !n.read_at);
        if (unreadNotifications.length > 0) {
            await Promise.all(unreadNotifications.map(n => markNotificationAsRead(n.id)));
        }

        try {
            const res = await getNotifications();
            setNotifications(res.data.notifications);
            setUnread(res.data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <Badge badgeContent={unread} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{ sx: { minWidth: 320 } }}
            >
                <MenuItem onClick={handleDeleteAll} disabled={notifications.length === 0}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    <ListItemText primary="Xóa tất cả thông báo" />
                </MenuItem>
                {notifications.length === 0 ? (
                    <MenuItem>
                        <ListItemText primary="Không có thông báo mới" />
                    </MenuItem>
                ) : (
                    notifications.map((noti) => (
                        <MenuItem key={noti.id} onClick={onClose} selected={!noti.read_at}>
                            <ListItemText
                                // primary={`Đơn hàng mới: :${noti.data.order_code} - ${noti.data.customer_name || "Khách lẻ"}`}
                                primary={`Đơn hàng mới: ${noti.data.order_code}`}
                                secondary={`Tổng tiền: ${Number(noti.data.total_price).toLocaleString()}đ`}
                            />
                            <IconButton
                                edge="end"
                                size="small"
                                color="error"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleDelete(noti.id);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default Notifycation;