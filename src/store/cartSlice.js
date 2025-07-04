import { createSlice } from "@reduxjs/toolkit";

const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: storedCart,
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existing = state.items.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                state.items.push({ ...item, quantity: item.quantity });
            }
            localStorage.setItem("cart", JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(i => i.id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },
        updateQuantity: (state, action) => {
            const { id, quantity, newSizeId, newSize, newPrice } = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                state.items[itemIndex].quantity = quantity;

                if (newSizeId && newSize && newPrice !== undefined) {
                    state.items[itemIndex].product_size_id = newSizeId;
                    state.items[itemIndex].size = newSize;
                    state.items[itemIndex].price = newPrice;

                    const newId = state.items[itemIndex].product_id + '-' + newSizeId;
                    state.items[itemIndex].id = newId;
                }
            }
            localStorage.setItem("cart", JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cart");
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;