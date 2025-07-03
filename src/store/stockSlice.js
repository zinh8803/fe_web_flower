import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkStockAvailable } from '../services/productService';

export const fetchStockAvailability = createAsyncThunk(
    'stock/fetchAvailability',
    async (cartItems = [], { rejectWithValue }) => {
        try {
            const response = await checkStockAvailable({ cart_items: cartItems });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to check stock');
        }
    }
);

const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        availableProducts: [],
        checkedDate: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockAvailability.fulfilled, (state, action) => {
                state.loading = false;
                state.availableProducts = action.payload.available_products;
                state.checkedDate = action.payload.checked_date;
            })
            .addCase(fetchStockAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to check stock';
            });
    },
});

export default stockSlice.reducer;