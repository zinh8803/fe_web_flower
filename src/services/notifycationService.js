import api from "./api";

export const getNotifications = () =>
    api.get(`/notifications`, {
        withCredentials: true,
    });

export const markNotificationAsRead = (id) =>
    api.post(`/notifications/${id}/mark-as-read`, {}, {
        withCredentials: true,
    });

export const deleteNotification = (id) =>
    api.delete(`/notifications/${id}`, {
        withCredentials: true,
    });
export const deleteAllNotifications = () =>
    api.delete(`/notifications`, {
        withCredentials: true,
    });