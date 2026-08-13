import React, { useState, useEffect, useCallback, useRef } from "react";
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
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import {
  initWebsocket,
  removeChatHandler,
} from "../../services/websocketService";
import {
  getMessagesWithPartner,
  sendMessage,
} from "../../services/messageService";

const formatMessageTime = (timeStr) => {
  if (!timeStr) return "";
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
};

const renderFormattedMessage = (text, isMe) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+|\b\/(?:products|flowers)\/\d+)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
    }
    parts.push({ type: "url", content: match[0] });
    lastIndex = urlRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.substring(lastIndex) });
  }

  return (
    <Typography
      variant="body2"
      component="div"
      sx={{
        wordBreak: "break-word",
        lineHeight: 1.5,
        fontSize: "0.875rem",
        whiteSpace: "pre-wrap"
      }}
    >
      {parts.map((item, idx) => {
        if (item.type === "url") {
          const href = item.content.startsWith("/")
            ? window.location.origin + item.content
            : item.content;
          return (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isMe ? "#fef08a" : "#2563eb",
                fontWeight: 700,
                textDecoration: "underline",
                wordBreak: "break-all"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.content}
            </a>
          );
        }
        return item.content;
      })}
    </Typography>
  );
};

const Message = ({ currentUserId: propUserId = "", adminId = 1 }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isSending, setIsSending] = useState(false);

  const user = useSelector((state) => state.user.user);
  const myUserId = propUserId || user?.id;

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  // Track IDs của tin mình vừa gửi để bỏ qua WS event tránh duplicate
  const sentMessageIdsRef = useRef(new Set());

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleOpen = () => {
    isFirstLoadRef.current = true;
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Load chat history when popup opens
  useEffect(() => {
    if (!open || !adminId) return;

    getMessagesWithPartner(adminId)
      .then((res) => {
        const history = (res.data || []).map((m) => {
          const isMe = myUserId ? String(m.sender_id) === String(myUserId) : m.sender_id !== adminId;
          return {
            id: m.id,
            isMe: isMe,
            text: m.message,
            time: m.created_at || m.createdAt
          };
        });

        setAllMessages(history);
        setVisibleCount(20);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  }, [open, adminId, myUserId]);

  // Scroll to bottom only on first load after opening dialog
  useEffect(() => {
    if (open && allMessages.length > 0 && isFirstLoadRef.current) {
      setTimeout(() => {
        scrollToBottom("auto");
        isFirstLoadRef.current = false;
      }, 50);
    }
  }, [open, allMessages]);

  // Realtime websocket handler
  const handleIncoming = useCallback(
    (data) => {
      console.log("[ws] Message (user) received", data);

      // Bỏ qua tin mình vừa gửi — đã có optimistic update + API response xử lý
      if (myUserId && String(data.sender_id) === String(myUserId)) return;

      const isMe = false; // Nếu qua được check trên, chắc chắn là tin của đối phương
      const newMsg = {
        id: data.id || Date.now(),
        isMe: isMe,
        text: data.message,
        time: data.created_at || new Date().toISOString()
      };

      setAllMessages((prev) => {
        if (data?.id != null && prev.some((m) => m.id === data.id)) return prev;
        return [...prev, newMsg];
      });
      setVisibleCount((prev) => prev + 1);

      // Auto scroll to bottom if near bottom
      const container = chatContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom) {
          setTimeout(() => scrollToBottom("smooth"), 50);
        }
      }
    },
    [myUserId, adminId]
  );

  useEffect(() => {
    initWebsocket(null, null, handleIncoming, myUserId || null, false);

    return () => {
      removeChatHandler({
        userId: myUserId || null,
        isStaff: false,
        onChatMessage: handleIncoming,
      });
    };
  }, [myUserId, handleIncoming]);

  // Handle scroll up to load older 20 messages without jumping
  const handleScroll = (e) => {
    const container = e.target;
    if (container.scrollTop <= 20 && visibleCount < allMessages.length) {
      const prevScrollHeight = container.scrollHeight;
      setVisibleCount((prev) => {
        const nextCount = Math.min(prev + 20, allMessages.length);
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          }
        }, 30);
        return nextCount;
      });
    }
  };

  const handleSend = async () => {
    if (isSending || !content.trim()) return;

    const text = content.trim();
    const tempId = Date.now();
    const nowIso = new Date().toISOString();

    const tempMessage = {
      id: tempId,
      isMe: true,
      text,
      time: nowIso
    };

    setAllMessages((prev) => [...prev, tempMessage]);
    setVisibleCount((prev) => prev + 1);
    setContent("");

    setTimeout(() => scrollToBottom("smooth"), 50);

    try {
      setIsSending(true);
      const res = await sendMessage({ message: text });
      if (res?.data?.id) {
        // Đăng ký ID thật để WS handler bỏ qua (tránh duplicate)
        sentMessageIdsRef.current.add(String(res.data.id));
        setAllMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.data.id, time: res.data.created_at || nowIso } : m))
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const displayedMessages = allMessages.slice(-visibleCount);
  const hasMore = visibleCount < allMessages.length;

  return (
    <>
      {/* Floating Chat Button */}
      <Box
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1300,
        }}>
        <Tooltip title="Liên hệ hỗ trợ">
          <Fab
            color="success"
            onClick={handleOpen}
            sx={{
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
              boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)"
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Floating Chat Window */}
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
            m: { xs: 1, sm: 3 },
            width: { xs: "92vw", sm: 360 },
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          },
        }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#16a34a",
            color: "#fff",
            py: 1.8,
            px: 2.5
          }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ChatIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={700}>
              Chat với Quản trị viên
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ p: 0, display: "flex", flexDirection: "column", height: 380, bgcolor: "#f8fafc" }}>
          {/* Chat Messages List */}
          <Box
            ref={chatContainerRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column"
            }}>
            {hasMore && (
              <Box textAlign="center" py={1} mb={1}>
                <Typography variant="caption" color="text.secondary" sx={{ bgcolor: "#e2e8f0", px: 1.5, py: 0.5, borderRadius: "10px" }}>
                  Vuốt lên để xem thêm tin nhắn cũ ({allMessages.length - visibleCount})
                </Typography>
              </Box>
            )}

            {displayedMessages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.isMe ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}>
                <Box
                  sx={{
                    maxWidth: "85%",
                    px: 2,
                    py: 1.2,
                    borderRadius: m.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: m.isMe ? "0 2px 8px rgba(22, 163, 74, 0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
                    bgcolor: m.isMe ? "#16a34a" : "#ffffff",
                    color: m.isMe ? "#ffffff" : "#1e293b",
                    border: m.isMe ? "none" : "1px solid #e2e8f0"
                  }}>
                  <Box display="flex" alignItems="flex-end" justifyContent="space-between" gap={1}>
                    <Box sx={{ flex: 1 }}>
                      {renderFormattedMessage(m.text, m.isMe)}
                    </Box>
                    {m.time && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.68rem",
                          color: m.isMe ? "rgba(255,255,255,0.75)" : "#94a3b8",
                          whiteSpace: "nowrap",
                          ml: 0.5,
                          userSelect: "none"
                        }}
                      >
                        {formatMessageTime(m.time)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}

            {!allMessages.length && (
              <Box textAlign="center" my="auto" py={4}>
                <Typography variant="body2" color="text.secondary">
                  Bắt đầu cuộc trò chuyện với tư vấn viên...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Box */}
          <Box sx={{ p: 1.5, bgcolor: "#fff", borderTop: "1px solid #e2e8f0", display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              autoFocus
              fullWidth
              multiline
              maxRows={3}
              size="small"
              placeholder="Nhập tin nhắn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: "0.875rem"
                }
              }}
            />
            <IconButton
              color="success"
              onClick={handleSend}
              disabled={!content.trim() || isSending}
              sx={{
                bgcolor: "#16a34a",
                color: "#fff",
                "&:hover": { bgcolor: "#15803d" },
                "&:disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
                width: 40,
                height: 40,
                flexShrink: 0
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Message;
