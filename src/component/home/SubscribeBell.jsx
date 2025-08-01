import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { getProfile, updateUserSubscribed } from '../../services/userService';
import { useSelector } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { showNotification } from "../../store/notificationSlice";

const SubscribeBell = () => {
    const dispatch = useDispatch();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [profile, setProfile] = useState(null);
    const user = useSelector((state) => state.user.user);
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (user) {
            setIsSubscribed(user.is_subscribe === 1);
        }
    }, [user]);


    const handleBellClick = () => {
        if (!user) {
            dispatch(showNotification({
                message: 'Vui lòng đăng nhập để nhận thông báo.',
                severity: 'info',
            }));
        } else if (!isSubscribed) {
            setOpenDialog(true);
        } else {
            handleUnsubscribe();
        }
    };

    const handleSubscribe = async () => {
        try {



            await updateUserSubscribed();
            getProfile().then(res => {
                setProfile(res.data.data);
                setIsSubscribed(true);
                dispatch(setUser({ user: res.data.data, token }));
            });
            dispatch(showNotification({
                message: 'Đăng ký nhận thông báo mã giảm giá thành công!',
                severity: 'success',
            }));
            setOpenDialog(false);
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            dispatch(showNotification({
                message: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!',
                severity: 'error',
            }));
            setOpenSnackbar(true);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await updateUserSubscribed();

            getProfile().then(res => {
                setProfile(res.data.data);
                setIsSubscribed(false);
                dispatch(setUser({ user: res.data.data, token }));
            });
            dispatch(showNotification({
                message: 'Hủy đăng ký nhận thông báo thành công!',
                severity: 'success',
            }));
        } catch (error) {
            console.error('Lỗi hủy đăng ký:', error);
            dispatch(showNotification({
                message: 'Đã xảy ra lỗi khi hủy đăng ký. Vui lòng thử lại!',
                severity: 'error',
            }));
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Tooltip title={isSubscribed ? "Đã đăng ký nhận thông báo mã giảm giá" : "Đăng ký nhận thông báo mã giảm giá"}>
                    <IconButton
                        onClick={handleBellClick}
                        sx={{
                            backgroundColor: isSubscribed ? '#4caf50' : '#f5f5f5',
                            color: isSubscribed ? 'white' : '#1976d2',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            padding: 2,
                            '&:hover': {
                                backgroundColor: isSubscribed ? '#43a047' : '#e0e0e0',
                            },
                        }}
                    >
                        {isSubscribed ? <NotificationsActiveIcon fontSize="large" /> : <NotificationsIcon fontSize="large" />}
                    </IconButton>
                </Tooltip>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Đăng ký nhận thông báo mã giảm giá</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn đăng ký nhận thông báo khi có mã giảm giá mới qua email không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleSubscribe} color="primary" variant="contained">Đăng ký</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >

            </Snackbar>
        </>
    );
};

export default SubscribeBell;