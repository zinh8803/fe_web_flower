import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import {
  initWebsocket,
  removeChatHandler,
} from "../../services/websocketService";
import {
  getMessagesWithPartner,
  sendMessage,
} from "../../services/messageService";

const Message = ({ currentUserId, adminId = 1 }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // load lịch sử chat khi mở popup
  useEffect(() => {
    // CHỈ kiểm tra open + adminId, KHÔNG chặn khi thiếu currentUserId
    if (!open || !adminId) return;

    getMessagesWithPartner(adminId)
      .then((res) => {
        const history = (res.data || []).map((m) => ({
          id: m.id,
          from: m.sender_id === currentUserId ? "user" : "admin",
          text: m.message,
        }));
        setMessages(history);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  }, [open, currentUserId, adminId]);

  // kết nối websocket để nhận tin nhắn realtime
  const handleIncoming = useCallback(
    (data) => {
      console.log("[ws] Message (user) received", data);

      // Dedupe theo id (tránh nhận cùng 1 event nhiều lần)
      setMessages((prev) => {
        if (data?.id != null && prev.some((m) => m.id === data.id)) return prev;

        return [
          ...prev,
          {
            id: data.id,
            from: data.sender_id === currentUserId ? "user" : "admin",
            text: data.message,
          },
        ];
      });
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!currentUserId) {
      console.warn("[ws] Message (user) skipped: missing currentUserId");
      return;
    }

    console.log("[ws] Message (user) init", { currentUserId });

    initWebsocket(null, null, handleIncoming, currentUserId);

    return () => {
      removeChatHandler({
        userId: currentUserId,
        isStaff: false,
        onChatMessage: handleIncoming,
      });
    };
  }, [currentUserId, handleIncoming]);

  const handleSend = async () => {
    if (isSending) return;
    if (!content.trim()) return;

    const text = content.trim();

    const userMessage = {
      id: Date.now(),
      from: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setContent("");

    try {
      setIsSending(true);
      await sendMessage({ message: text });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Nút tròn liên hệ nổi góc phải dưới */}
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1300,
        }}>
        <Tooltip title="Liên hệ quản trị viên">
          <Fab color="primary" onClick={handleOpen}>
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Hộp thoại nhắn tin nhỏ ở góc phải dưới */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        hideBackdrop
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-end",
            justifyContent: "flex-end",
          },
          "& .MuiPaper-root": {
            m: 2,
            width: 320,
            borderRadius: 2,
          },
        }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          Nhắn tin cho quản trị viên
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Khu vực chat + ô nhập tin nhắn */}
        <DialogContent
          dividers
          sx={{ p: 0, display: "flex", flexDirection: "column", height: 320 }}>
          {/* danh sách tin nhắn */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
            }}>
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}>
                <Box
                  sx={{
                    maxWidth: "80%",
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: 1,
                    bgcolor: m.from === "user" ? "primary.main" : "#ffffff",
                    color:
                      m.from === "user"
                        ? "primary.contrastText"
                        : "text.primary",
                  }}>
                  <Typography variant="body2">{m.text}</Typography>
                </Box>
              </Box>
            ))}

            {!messages.length && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 8 }}>
                Bắt đầu cuộc trò chuyện với quản trị viên...
              </Typography>
            )}
          </Box>

          {/* ô nhập tin nhắn */}
          <Box sx={{ p: 1.5, borderTop: "1px solid #eee" }}>
            <TextField
              autoFocus
              fullWidth
              multiline
              maxRows={3}
              placeholder="Nhập tin nhắn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5, pt: 0.5 }}>
          <Button onClick={handleClose}>Đóng</Button>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!content.trim() || isSending}>
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Message;
