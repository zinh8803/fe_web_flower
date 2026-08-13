import api from "./api";

export const getCart = () =>
    api.get("/cart", {
        withCredentials: true,
    });

export const addCartItem = (item) =>
    api.post("/cart/items", item, {
        withCredentials: true,
    });

export const updateCartItem = (itemId, payload) =>
    api.put(`/cart/items/${encodeURIComponent(itemId)}`, payload, {
        withCredentials: true,
    });

export const removeCartItem = (itemId) =>
    api.delete(`/cart/items/${encodeURIComponent(itemId)}`, {
        withCredentials: true,
    });

export const clearCartApi = () =>
    api.delete("/cart/clear", {
        withCredentials: true,
    });
