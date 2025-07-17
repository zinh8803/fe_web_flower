import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echoInstance = null;

export function initWebsocket(onOrderCreated) {
    if (!echoInstance) {
        window.Pusher = Pusher;
        echoInstance = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        echoInstance.channel("admin-orders")
            .listen("OrderCreated", (data) => {
                if (typeof onOrderCreated === "function") {
                    onOrderCreated(data);
                }
            });
    }
    return echoInstance;
}