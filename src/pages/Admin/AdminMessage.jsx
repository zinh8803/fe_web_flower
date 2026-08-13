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
  IconButton,
  Avatar
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import {
  initWebsocket,
  removeChatHandler,
} from "../../services/websocketService";
import {
  getMessagesWithPartner,
  sendMessage,
  getUserMessagesToAdminHistory,
} from "../../services/messageService";
import { User, MessageSquare } from "lucide-react";

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
      variant="body1"
      component="div"
      sx={{
        wordBreak: "break-word",
        lineHeight: 1.5,
        fontSize: "0.95rem",
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

const AdminMessage = ({ currentUserId: propUserId }) => {
  const user = useSelector((state) => state.user.user);
  const myUserId = propUserId || user?.id;

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  // Track IDs của tin mình vừa gửi để bỏ qua WS event tránh duplicate
  const sentMessageIdsRef = useRef(new Set());

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Load customer chat history list
  const fetchCustomerList = useCallback(() => {
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
              name: sender.name || `Khách hàng #${sender.id}`,
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
  }, [selectedCustomerId]);

  useEffect(() => {
    fetchCustomerList();
  }, [fetchCustomerList]);

  // Load message thread when customer is selected
  useEffect(() => {
    if (!selectedCustomerId) return;

    isFirstLoadRef.current = true;
    getMessagesWithPartner(selectedCustomerId)
      .then((res) => {
        const history = (res.data || []).map((m) => {
          const isMe = myUserId ? String(m.sender_id) === String(myUserId) : String(m.sender_id) !== String(selectedCustomerId);
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
        console.error("Failed to load chat with customer:", err);
      });
  }, [selectedCustomerId, myUserId]);

  // Scroll to bottom only on first load after selecting customer
  useEffect(() => {
    if (selectedCustomerId && allMessages.length > 0 && isFirstLoadRef.current) {
      setTimeout(() => {
        scrollToBottom("auto");
        isFirstLoadRef.current = false;
      }, 50);
    }
  }, [selectedCustomerId, allMessages]);

  const selectedCustomerIdRef = useRef(null);
  useEffect(() => {
    selectedCustomerIdRef.current = selectedCustomerId;
  }, [selectedCustomerId]);

  const handleIncomingChatMessage = useCallback(
    (data) => {
      const { sender_id, receiver_id, message, id, group } = data;
      const otherUserId = group ? sender_id : receiver_id ?? sender_id;
      if (!otherUserId) return;

      // Bỏ qua tin mình vừa gửi — đã có optimistic update + API response xử lý
      if (myUserId && String(sender_id) === String(myUserId)) return;

      const currentSelected = selectedCustomerIdRef.current;

      if (currentSelected && String(otherUserId) === String(currentSelected)) {
        const isMe = myUserId ? String(sender_id) === String(myUserId) : String(sender_id) !== String(otherUserId);
        const newMsg = {
          id: id || Date.now(),
          isMe: isMe,
          text: message,
          time: data.created_at || new Date().toISOString()
        };

        setAllMessages((prev) => {
          if (id != null && prev.some((m) => m.id === id)) return prev;
          return [...prev, newMsg];
        });
        setVisibleCount((prev) => prev + 1);

        const container = chatContainerRef.current;
        if (container) {
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
          if (isNearBottom) {
            setTimeout(() => scrollToBottom("smooth"), 50);
          }
        }
      }

      setCustomers((prev) => {
        const now = new Date().toISOString();
        const existing = prev.find((c) => String(c.id) === String(otherUserId));

        const next = existing
          ? prev.map((c) =>
              String(c.id) === String(otherUserId)
                ? { ...c, lastMessage: message, lastMessageTime: now }
                : c
            )
          : [
              {
                id: otherUserId,
                name: `Khách hàng #${otherUserId}`,
                lastMessage: message,
                lastMessageTime: now,
              },
              ...prev,
            ];

        return next.sort((a, b) =>
          a.lastMessageTime < b.lastMessageTime ? 1 : -1
        );
      });

      if (!currentSelected) setSelectedCustomerId(otherUserId);
    },
    [setCustomers, setSelectedCustomerId, myUserId]
  );

  useEffect(() => {
    initWebsocket(
      null,
      null,
      handleIncomingChatMessage,
      myUserId || null,
      true
    );

    return () => {
      removeChatHandler({
        userId: myUserId || null,
        isStaff: true,
        onChatMessage: handleIncomingChatMessage,
      });
    };
  }, [myUserId, handleIncomingChatMessage]);

  // Handle scroll up to load older 20 messages
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

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
  };

  const handleSend = async () => {
    if (isSending || !content.trim() || !selectedCustomerId) return;

    const text = content.trim();
    const tempId = Date.now();
    const nowIso = new Date().toISOString();

    const localMessage = { id: tempId, isMe: true, text, time: nowIso };
    setAllMessages((prev) => [...prev, localMessage]);
    setVisibleCount((prev) => prev + 1);
    setContent("");

    setTimeout(() => scrollToBottom("smooth"), 50);

    try {
      setIsSending(true);
      const res = await sendMessage({ receiver_id: selectedCustomerId, message: text });
      if (res?.data?.id) {
        // Đăng ký ID thật để WS handler bỏ qua (tránh duplicate)
        sentMessageIdsRef.current.add(String(res.data.id));
        setAllMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: res.data.id, time: res.data.created_at || nowIso } : m))
        );
      }
    } catch (err) {
      console.error("Failed to send admin message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const currentCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));
  const displayedMessages = allMessages.slice(-visibleCount);
  const hasMore = visibleCount < allMessages.length;

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 80px)", p: { xs: 1.5, sm: 3 }, gap: 2.5 }}>
      {/* Customer List Side Panel */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: 220, sm: 320 },
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
        <Box p={2.5} display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "rgba(22, 163, 74, 0.1)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <MessageSquare size={20} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="#1e293b">
            Hội thoại ({customers.length})
          </Typography>
        </Box>
        <Divider />
        <List dense sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {customers.map((c) => {
            const isSelected = String(c.id) === String(selectedCustomerId);
            return (
              <ListItemButton
                key={c.id}
                selected={isSelected}
                onClick={() => handleSelectCustomer(c.id)}
                sx={{
                  borderRadius: "12px",
                  mb: 0.5,
                  p: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(22, 163, 74, 0.1)",
                    color: "#16a34a",
                    "&:hover": { bgcolor: "rgba(22, 163, 74, 0.15)" }
                  }
                }}
              >
                <Avatar sx={{ bgcolor: isSelected ? "#16a34a" : "#f1f5f9", color: isSelected ? "#fff" : "#64748b", mr: 1.5, width: 36, height: 36, fontSize: "0.9rem" }}>
                  <User size={18} />
                </Avatar>
                <ListItemText
                  primary={c.name}
                  secondary={c.lastMessage}
                  primaryTypographyProps={{ fontWeight: 700, noWrap: true, fontSize: "0.9rem" }}
                  secondaryTypographyProps={{ noWrap: true, fontSize: "0.8rem" }}
                />
              </ListItemButton>
            );
          })}
          {!customers.length && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có cuộc trò chuyện nào.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Main Chat Thread Area */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
        {/* Chat Thread Header */}
        <Box sx={{ p: 2.5, borderBottom: "1px solid #e2e8f0", bgcolor: "#fff", display: "flex", alignItems: "center", gap: 1.5 }}>
          {selectedCustomerId ? (
            <>
              <Avatar sx={{ bgcolor: "rgba(22, 163, 74, 0.1)", color: "#16a34a", width: 40, height: 40 }}>
                <User size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  {currentCustomer?.name || `Khách hàng #${selectedCustomerId}`}
                </Typography>
                <Typography variant="caption" color="#16a34a" fontWeight={600}>
                  Đang hoạt động
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="h6" color="#64748b">
              Chọn một cuộc hội thoại từ danh sách bên trái
            </Typography>
          )}
        </Box>

        {/* Message Thread */}
        <Box
          ref={chatContainerRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            bgcolor: "#f8fafc",
            display: "flex",
            flexDirection: "column"
          }}>
          {hasMore && (
            <Box textAlign="center" py={1} mb={2}>
              <Typography variant="caption" color="text.secondary" sx={{ bgcolor: "#e2e8f0", px: 2, py: 0.8, borderRadius: "10px" }}>
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
                mb: 1.8,
              }}>
              <Box
                sx={{
                  maxWidth: "75%",
                  px: 2.2,
                  py: 1.3,
                  borderRadius: m.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  boxShadow: m.isMe ? "0 4px 12px rgba(22, 163, 74, 0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
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

          {!allMessages.length && selectedCustomerId && (
            <Box textAlign="center" my="auto" py={6}>
              <Typography variant="body2" color="text.secondary">
                Bắt đầu trò chuyện với khách hàng...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e2e8f0", display: "flex", gap: 1.5, alignItems: "center" }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder={selectedCustomerId ? "Nhập tin nhắn phản hồi..." : "Chọn khách hàng để phản hồi"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={!selectedCustomerId}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px"
              }
            }}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={handleSend}
            disabled={!content.trim() || !selectedCustomerId || isSending}
            startIcon={<SendIcon fontSize="small" />}
            sx={{
              bgcolor: "#16a34a",
              color: "#fff",
              px: 3,
              py: 1,
              borderRadius: "12px",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#15803d" },
              "&:disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" }
            }}
          >
            Gửi
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminMessage;
