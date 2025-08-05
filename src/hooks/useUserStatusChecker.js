import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getProfile } from '../services/userService';
import { logoutAndClearCart } from '../store/userSlice';
import { showNotification } from '../store/notificationSlice';

export const useUserStatusChecker = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const location = useLocation();
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

        checkUserStatus();

    }, [user, dispatch, location.pathname]);

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

        const interval = setInterval(checkUserStatus, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user, dispatch]);
};