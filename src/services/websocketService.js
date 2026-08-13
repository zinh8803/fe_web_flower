import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echoInstance = null;

// tránh subscribe nhiều lần
const attached = {
    adminMessages: false,
    privateChat: new Set(),
};

// registry handlers (nhiều component có thể đăng ký)
const chatHandlers = {
    adminMessages: new Set(), // Set<function>
    privateChat: new Map(),   // Map<userId, Set<function>>
};

function addPrivateHandler(userId, fn) {
    if (!userId || typeof fn !== "function") return;
    const key = String(userId);
    if (!chatHandlers.privateChat.has(key)) chatHandlers.privateChat.set(key, new Set());
    chatHandlers.privateChat.get(key).add(fn);
}

function removePrivateHandler(userId, fn) {
    if (!userId || typeof fn !== "function") return;
    const key = String(userId);
    const set = chatHandlers.privateChat.get(key);
    if (!set) return;
    set.delete(fn);
    if (set.size === 0) chatHandlers.privateChat.delete(key);
}

function emitPrivate(userId, data) {
    if (shouldDropEvent(data)) return;
    const key = String(userId);
    const set = chatHandlers.privateChat.get(key);
    if (!set) return;
    for (const fn of set) fn(data);
}

function addAdminHandler(fn) {
    if (typeof fn !== "function") return;
    chatHandlers.adminMessages.add(fn);
}

function removeAdminHandler(fn) {
    if (typeof fn !== "function") return;
    chatHandlers.adminMessages.delete(fn);
}

function emitAdmin(data) {
    if (shouldDropEvent(data)) return;
    for (const fn of chatHandlers.adminMessages) fn(data);
}

export function removeChatHandler({ userId, isStaff = false, onChatMessage }) {
    if (typeof onChatMessage !== "function") return;
    if (isStaff) removeAdminHandler(onChatMessage);
    if (userId) removePrivateHandler(userId, onChatMessage);
}

export function initWebsocket(onOrderCreated, onAutoImport, onChatMessage, userId, isStaff = false) {
    console.log("[ws] initWebsocket()", { hasEcho: !!echoInstance, userId, isStaff, hasOnChat: typeof onChatMessage === "function" });

    if (typeof onChatMessage === "function") {
        if (isStaff) addAdminHandler(onChatMessage);
        if (userId) addPrivateHandler(userId, onChatMessage);
    }

    if (!echoInstance) {
        window.Pusher = Pusher;
        Pusher.logToConsole = true; // Bật log Pusher để debug

        echoInstance = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY || "local",
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || "ap1",
            forceTLS: true,
            authEndpoint: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/broadcasting/auth`,
            // Gửi cookie (withCredentials) để backend xác thực JWT từ cookie
            auth: {
                headers: {
                    "Accept": "application/json",
                },
                params: {},
            },
            // Custom authorizer: gửi kèm cookie
            authorizer: (channel) => ({
                authorize: (socketId, callback) => {
                    console.log("[ws] authorizing channel:", channel.name);
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/broadcasting/auth`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        // credentials: "include" để browser tự gửi cookie
                        credentials: "include",
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channel.name,
                        }),
                    })
                        .then((res) => {
                            console.log("[ws] broadcasting/auth status:", res.status);
                            if (!res.ok) {
                                res.text().then(t => console.error("[ws] auth error:", t));
                                callback(new Error("Unauthorized"), null);
                                return;
                            }
                            return res.json();
                        })
                        .then((data) => {
                            if (data) {
                                console.log("[ws] auth success ✅");
                                callback(null, data);
                            }
                        })
                        .catch((err) => {
                            console.error("[ws] auth error:", err);
                            callback(err, null);
                        });
                },
            }),
        });

        const conn = echoInstance.connector?.pusher?.connection;
        conn?.bind("connected", () => console.log("[ws] pusher connected ✅"));
        conn?.bind("error", (err) => console.error("[ws] pusher error ❌", err));
        conn?.bind("state_change", (states) => console.log("[ws] pusher state:", states.previous, "→", states.current));

        echoInstance.channel("admin-orders").listen("OrderCreated", (data) => {
            if (typeof onOrderCreated === "function") onOrderCreated(data);
        });

        echoInstance.channel("admin-auto-imports").listen("AutoImport", (data) => {
            if (typeof onAutoImport === "function") onAutoImport(data);
        });
    }

    // Subscribe private chat.{userId} 1 lần, emit cho mọi handler
    if (userId && !attached.privateChat.has(String(userId))) {
        attached.privateChat.add(String(userId));
        console.log("[ws] subscribing private", `chat.${userId}`);

        const handlePrivateEvent = (data) => {
            console.log("[ws] NewChatMessage received on private-chat:", data.id);
            emitPrivate(userId, data);
        };

        // Chỉ subscribe private channel (không cần public fallback nữa vì auth đã hoạt động)
        const privCh = echoInstance.private(`chat.${userId}`);
        privCh.listen(".NewChatMessage", handlePrivateEvent);

        privCh.subscribed?.(() => console.log("[ws] subscribed ✅ private-chat.", userId));
        privCh.error?.((e) => console.error("[ws] private subscription error", `chat.${userId}`, e));
    }

    // Subscribe admin-messages 1 lần, emit cho mọi handler
    if (isStaff && !attached.adminMessages) {
        attached.adminMessages = true;
        console.log("[ws] subscribing public admin-messages");

        const ch = echoInstance.channel("admin-messages");

        const handleAdminEvent = (data) => {
            console.log("[ws] NewChatMessage received on admin-messages:", data.id);
            emitAdmin(data);
        };

        ch.listen(".NewChatMessage", handleAdminEvent);

        ch.subscribed?.(() => console.log("[ws] subscribed ✅ admin-messages"));
        ch.error?.((e) => console.error("[ws] admin-messages subscription error:", e));
    }

    return echoInstance;
}

// Dedupe event theo id ở layer service
const seenEventIds = new Set();
function shouldDropEvent(data) {
    const id = data?.id;
    if (id == null) return false;
    const key = String(id);
    if (seenEventIds.has(key)) return true;
    seenEventIds.add(key);
    if (seenEventIds.size > 5000) seenEventIds.clear();
    return false;
}
