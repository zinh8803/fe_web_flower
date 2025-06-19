import api from "./api";

export const sendOtpMail = async (email) => api.post("/send-otp", { email });