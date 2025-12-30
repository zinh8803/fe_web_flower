import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import {
  initWebsocket,
  removeChatHandler,
} from "../../services/websocketService";
import {
  getMessagesWithPartner,
  sendMessage,
  getUserMessagesToAdminHistory,
} from "../../services/messageService";

const AdminMessage = ({ currentUserId }) => {
  const [customers, setCustomers] = useState([]); // danh sách user đã nhắn
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Lấy danh sách user đã gửi tin nhắn cho admin (to_staff_group = true)
  useEffect(() => {
    getUserMessagesToAdminHistory()
      .then((res) => {
        const list = res.data || [];
        const map = new Map();

        list.forEach((m) => {
          const sender = m.sender;
          if (!sender) return;
          const prev = map.get(sender.id);
          const createdAt = m.created_at || m.createdAt || null;

          if (!prev || (createdAt && createdAt > prev.lastMessageTime)) {
            map.set(sender.id, {
              id: sender.id,
              name: sender.name || `User #${sender.id}`,
              lastMessage: m.message,
              lastMessageTime: createdAt,
            });
          }
        });

        const customersArr = Array.from(map.values()).sort((a, b) => {
          if (!a.lastMessageTime || !b.lastMessageTime) return 0;
          return a.lastMessageTime < b.lastMessageTime ? 1 : -1;
        });

        setCustomers(customersArr);
        if (customersArr.length && !selectedCustomerId) {
          setSelectedCustomerId(customersArr[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load user->admin history:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi chọn customer -> load toàn bộ cuộc hội thoại với user đó
  useEffect(() => {
    if (!selectedCustomerId) return;

    getMessagesWithPartner(selectedCustomerId)
      .then((res) => {
        const history = (res.data || []).map((m) => ({
          id: m.id,
          from: m.sender_id === currentUserId ? "admin" : "user",
          text: m.message,
        }));
        setMessages(history);
      })
      .catch((err) => {
        console.error("Failed to load chat with customer:", err);
      });
  }, [selectedCustomerId, currentUserId]);

  // Giữ selectedCustomerId "mới nhất" để websocket handler không bị stale closure
  const selectedCustomerIdRef = useRef(null);
  useEffect(() => {
    selectedCustomerIdRef.current = selectedCustomerId;
  }, [selectedCustomerId]);

  // Websocket handler ổn định, đọc selectedCustomerId qua ref
  const handleIncomingChatMessage = useCallback(
    (data) => {
      const { sender_id, receiver_id, message, id, group } = data;
      const otherUserId = group ? sender_id : receiver_id ?? sender_id;
      if (!otherUserId) return;

      const currentSelected = selectedCustomerIdRef.current;

      if (currentSelected && otherUserId === currentSelected) {
        setMessages((prev) => {
          // Dedupe theo id (tránh nhận cùng 1 event nhiều lần)
          if (id != null && prev.some((m) => m.id === id)) return prev;

          return [
            ...prev,
            {
              id,
              from: sender_id === otherUserId ? "user" : "admin",
              text: message,
            },
          ];
        });
      }

      setCustomers((prev) => {
        const now = new Date().toISOString();
        const existing = prev.find((c) => c.id === otherUserId);

        const next = existing
          ? prev.map((c) =>
              c.id === otherUserId
                ? { ...c, lastMessage: message, lastMessageTime: now }
                : c
            )
          : [
              {
                id: otherUserId,
                name: `User #${otherUserId}`,
                lastMessage: message,
                lastMessageTime: now,
              },
              ...prev,
            ];

        return next.sort((a, b) =>
          a.lastMessageTime < b.lastMessageTime ? 1 : -1
        );
      });

      // nếu chưa chọn ai (tại thời điểm hiện tại), tự chọn luôn user vừa nhắn
      if (!currentSelected) setSelectedCustomerId(otherUserId);
    },
    [setCustomers, setSelectedCustomerId]
  );

  // Websocket: nhận tin nhắn realtime gửi tới admin hiện tại
  useEffect(() => {
    console.log("[ws] AdminMessage init", { currentUserId });
    initWebsocket(
      null,
      null,
      handleIncomingChatMessage,
      currentUserId ?? null,
      true
    );

    return () => {
      removeChatHandler({
        userId: currentUserId ?? null,
        isStaff: true,
        onChatMessage: handleIncomingChatMessage,
      });
    };
  }, [currentUserId, handleIncomingChatMessage]);

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
  };

  const handleSend = async () => {
    if (isSending) return;
    if (!content.trim() || !selectedCustomerId || !currentUserId) return;

    const text = content.trim();

    const localMessage = { id: Date.now(), from: "admin", text };
    setMessages((prev) => [...prev, localMessage]);
    setContent("");

    try {
      setIsSending(true);
      await sendMessage({ receiver_id: selectedCustomerId, message: text });
    } catch (err) {
      console.error("Failed to send admin message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", p: 2 }}>
      {/* Danh sách khách hàng */}
      <Paper
        elevation={1}
        sx={{ width: 280, mr: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Khách hàng liên hệ
        </Typography>
        <Divider />
        <List dense sx={{ flex: 1, overflowY: "auto" }}>
          {customers.map((c) => (
            <ListItemButton
              key={c.id}
              selected={c.id === selectedCustomerId}
              onClick={() => handleSelectCustomer(c.id)}>
              <ListItemText
                primary={c.name}
                secondary={c.lastMessage}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          ))}
          {!customers.length && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có khách hàng nào nhắn tin.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Khung chat với khách hàng */}
      <Paper
        elevation={1}
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6">
            {selectedCustomerId
              ? `Chat với khách #${selectedCustomerId}`
              : "Chọn một khách hàng để bắt đầu chat"}
          </Typography>
        </Box>

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
                justifyContent: m.from === "admin" ? "flex-end" : "flex-start",
                mb: 1,
              }}>
              <Box
                sx={{
                  maxWidth: "70%",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: m.from === "admin" ? "primary.main" : "#ffffff",
                  color:
                    m.from === "admin"
                      ? "primary.contrastText"
                      : "text.primary",
                }}>
                <Typography variant="body2">{m.text}</Typography>
              </Box>
            </Box>
          ))}
          {!messages.length && selectedCustomerId && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 4 }}>
              Chưa có tin nhắn nào, hãy bắt đầu cuộc trò chuyện.
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder={
              selectedCustomerId
                ? "Nhập tin nhắn..."
                : "Chọn khách hàng để gửi tin nhắn"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={!selectedCustomerId}
          />
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!content.trim() || !selectedCustomerId || isSending}>
              Gửi
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminMessage;
