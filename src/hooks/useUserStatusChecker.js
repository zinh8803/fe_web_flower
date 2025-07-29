import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProfile } from '../services/userService';
import { logoutAndClearCart } from '../store/userSlice';
import { showNotification } from '../store/notificationSlice';

export const useUserStatusChecker = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const location = useLocation(); // Theo dõi sự thay đổi route

    useEffect(() => {
        if (!user) return;

        const checkUserStatus = async () => {
            try {
                const response = await getProfile();
                const currentUser = response.data.data;

                if (currentUser.status === 0) {
                    dispatch(logoutAndClearCart());
                    dispatch(showNotification({
                        message: 'Tài khoản của bạn đã bị khóa!',
                        severity: 'error'
                    }));
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        // Kiểm tra ngay khi component mount hoặc route thay đổi
        checkUserStatus();

    }, [user, dispatch, location.pathname]); // Thêm location.pathname vào dependency

    // useEffect riêng cho interval check
    useEffect(() => {
        if (!user) return;

        const checkUserStatus = async () => {
            try {
                const response = await getProfile();
                const currentUser = response.data.data;

                if (currentUser.status === 0) {
                    dispatch(logoutAndClearCart());
                    dispatch(showNotification({
                        message: 'Tài khoản của bạn đã bị khóa!',
                        severity: 'error'
                    }));
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        // Kiểm tra định kỳ mỗi 5 phút
        const interval = setInterval(checkUserStatus, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user, dispatch]);
};