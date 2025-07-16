import api from "./api";

export const sendOtpMail = async (email) => api.post("/send-otp", { email });

export const sendResetPassword = async (email) => api.post("/send-otp-reset-password", { email });