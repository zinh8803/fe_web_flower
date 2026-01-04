import api from "./api";

export const getMessagesWithPartner = (partnerId) =>
    api.get(`/chat/messages/${partnerId}`, { withCredentials: true });

export const sendMessage = (data) =>
    api.post("/chat/messages", data, { withCredentials: true });

// Lịch sử tin nhắn user gửi cho admin/employee (to_staff_group = true)
export const getUserMessagesToAdminHistory = (senderId) =>
    api.get("/chat/messages/history-sender-to-admin", {
        params: senderId ? { sender_id: senderId } : {},
        withCredentials: true,
    });