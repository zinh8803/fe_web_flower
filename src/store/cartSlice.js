import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addCartItem,
    clearCartApi,
    getCart,
    removeCartItem,
    updateCartItem,
} from "../services/cartService";
import { checkStockAvailable } from "../services/productService";

const extractCartItems = (response) => response?.data?.data || [];

const findSizeStock = (stockResponse, productSizeId) => {
    const availableProducts = stockResponse?.data?.available_products || [];

    for (const product of availableProducts) {
        const matchedSize = (product.sizes || []).find(
            (size) => Number(size.size_id) === Number(productSizeId)
        );
        if (matchedSize) {
            return matchedSize;
        }
    }

    return null;
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();
            return extractCartItems(response);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải giỏ hàng");
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (item, { rejectWithValue }) => {
        try {
            const stockResponse = await checkStockAvailable({
                cart_items: [
                    {
                        product_size_id: item.product_size_id,
                        quantity: item.quantity,
                    },
                ],
            });

            const sizeStock = findSizeStock(stockResponse, item.product_size_id);
            if (!sizeStock || !sizeStock.in_stock || Number(sizeStock.max_quantity) <= 0) {
                return rejectWithValue("Sản phẩm đã hết hàng");
            }

            if (Number(item.quantity) > Number(sizeStock.max_quantity)) {
                return rejectWithValue(`Số lượng vượt tồn kho. Tối đa: ${Number(sizeStock.max_quantity)}`);
            }

            const response = await addCartItem(item);
            return extractCartItems(response);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể thêm sản phẩm vào giỏ hàng");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await removeCartItem(itemId);
            return extractCartItems(response);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa sản phẩm khỏi giỏ hàng");
        }
    }
);

export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateCartItem(payload.id, payload);
            return extractCartItems(response);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật giỏ hàng");
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await clearCartApi();
            return extractCartItems(response);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Không thể làm trống giỏ hàng");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;