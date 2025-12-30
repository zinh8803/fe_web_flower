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

// NEW: cho component cleanup để tránh duplicate handler
export function removeChatHandler({ userId, isStaff = false, onChatMessage }) {
    if (typeof onChatMessage !== "function") return;
    if (isStaff) removeAdminHandler(onChatMessage);
    if (userId) removePrivateHandler(userId, onChatMessage);
}

export function initWebsocket(onOrderCreated, onAutoImport, onChatMessage, userId, isStaff = false) {
    // DEBUG: xác nhận initWebsocket có được gọi không
    console.log("[ws] initWebsocket()", { hasEcho: !!echoInstance, userId, isStaff, hasOnChat: typeof onChatMessage === "function" });

    // Register handler trước (để dù subscribe đã có sẵn thì vẫn nhận)
    if (typeof onChatMessage === "function") {
        if (isStaff) addAdminHandler(onChatMessage);
        if (userId) addPrivateHandler(userId, onChatMessage);
    }

    if (!echoInstance) {
        window.Pusher = Pusher;

        // Bật log pusher để thấy connect/subscription trong console
        Pusher.logToConsole = true;

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("accessToken") ||
            "";

        echoInstance = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,

            // Tránh "im lặng" vì ép TLS trong môi trường http/local
            forceTLS: window.location.protocol === "https:",

            // Auth cho private channel (routes/api.php => /api/...)
            authEndpoint: "/api/broadcasting/auth",
            ...(token
                ? {
                    auth: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                }
                : {}),
        });

        // DEBUG: trạng thái kết nối
        const conn = echoInstance.connector?.pusher?.connection;
        conn?.bind("connected", () => console.log("[ws] pusher connected"));
        conn?.bind("error", (err) => console.error("[ws] pusher error", err));

        echoInstance.channel("admin-orders").listen("OrderCreated", (data) => {
            if (typeof onOrderCreated === "function") onOrderCreated(data);
        });

        echoInstance.channel("admin-auto-imports").listen("AutoImport", (data) => {
            console.log("AutoImport event received:", data);
            if (typeof onAutoImport === "function") onAutoImport(data);
        });

        // DEBUG env (nếu key/cluster rỗng sẽ connect fail)
        if (!import.meta.env.VITE_PUSHER_APP_KEY || !import.meta.env.VITE_PUSHER_APP_CLUSTER) {
            console.warn("[ws] Missing VITE_PUSHER_APP_KEY / VITE_PUSHER_APP_CLUSTER");
        }
    }

    // Subscribe private chat.{userId} 1 lần, emit cho mọi handler
    if (userId && !attached.privateChat.has(String(userId))) {
        attached.privateChat.add(String(userId));
        console.log("[ws] subscribing private", `chat.${userId}`);

        const ch = echoInstance.private(`chat.${userId}`);

        // QUAN TRỌNG: chỉ listen 1 kiểu để tránh double fire
        ch.listen(".NewChatMessage", (data) => {
            console.log("NewChatMessage (private) received:", data);
            emitPrivate(userId, data);
        });

        ch.subscribed?.(() => console.log("[ws] subscribed private", `chat.${userId}`));
        ch.error?.((e) => console.error("[ws] private subscription error", `chat.${userId}`, e));
    }

    // Subscribe admin-messages 1 lần, emit cho mọi handler
    if (isStaff && !attached.adminMessages) {
        attached.adminMessages = true;
        console.log("[ws] subscribing public admin-messages");

        const ch = echoInstance.channel("admin-messages");

        // QUAN TRỌNG: chỉ listen 1 kiểu để tránh double fire
        ch.listen(".NewChatMessage", (data) => {
            console.log("NewChatMessage (admin-messages) received:", data);
            emitAdmin(data);
        });

        ch.subscribed?.(() => console.log("[ws] subscribed public admin-messages"));
        ch.error?.((e) => console.error("[ws] public subscription error admin-messages", e));
    }

    return echoInstance;
}

// Dedupe event theo id ở layer service (phòng trường hợp event bị deliver lặp)
const seenEventIds = new Set(); // Set<string>
function shouldDropEvent(data) {
    const id = data?.id;
    if (id == null) return false;
    const key = String(id);
    if (seenEventIds.has(key)) return true;
    seenEventIds.add(key);
    // giới hạn bộ nhớ đơn giản
    if (seenEventIds.size > 5000) seenEventIds.clear();
    return false;
}

