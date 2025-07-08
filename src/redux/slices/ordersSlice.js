import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

const initialState = {
  orders: [],
  orderActivities: [],
  currentOrderNumber: "#252596",
  loading: false,
  error: null,
  fetchingActivities: false,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            id,
            name,
            description,
            price,
            quantity,
            category,
            image_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*)
        `
        )
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchOrderActivities = createAsyncThunk(
  "orders/fetchOrderActivities",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("order_activities")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderItemQuantity = createAsyncThunk(
  "orders/updateOrderItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .update({ quantity })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeOrderItem = createAsyncThunk(
  "orders/removeOrderItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("order_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addOrderActivity = createAsyncThunk(
  "orders/addOrderActivity",
  async (activityData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("order_activities")
        .insert([
          {
            ...activityData,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set current order number
    setCurrentOrderNumber: (state, action) => {
      state.currentOrderNumber = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear orders (for logout etc.)
    clearOrders: (state) => {
      state.orders = [];
      state.orderActivities = [];
    },

    // Optimistic update for quantity (for immediate UI feedback)
    updateQuantityOptimistic: (state, action) => {
      const { itemId, quantity } = action.payload;
      const order = state.orders.find((order) =>
        order.order_items?.some((item) => item.id === itemId)
      );
      if (order) {
        const item = order.order_items.find((item) => item.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        // Update existing order or add new one
        const existingIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch order activities
      .addCase(fetchOrderActivities.pending, (state) => {
        state.fetchingActivities = true;
      })
      .addCase(fetchOrderActivities.fulfilled, (state, action) => {
        state.fetchingActivities = false;
        state.orderActivities = action.payload;
      })
      .addCase(fetchOrderActivities.rejected, (state, action) => {
        state.fetchingActivities = false;
        state.error = action.payload;
      })

      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // Add to beginning
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order item quantity
      .addCase(updateOrderItemQuantity.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const order = state.orders.find((order) =>
          order.order_items?.some((item) => item.id === updatedItem.id)
        );
        if (order) {
          const itemIndex = order.order_items.findIndex(
            (item) => item.id === updatedItem.id
          );
          if (itemIndex >= 0) {
            order.order_items[itemIndex] = updatedItem;
          }
        }
      })
      .addCase(updateOrderItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove order item
      .addCase(removeOrderItem.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.orders.forEach((order) => {
          if (order.order_items) {
            order.order_items = order.order_items.filter(
              (item) => item.id !== itemId
            );
          }
        });
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (orderIndex >= 0) {
          state.orders[orderIndex] = {
            ...state.orders[orderIndex],
            ...updatedOrder,
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Add order activity
      .addCase(addOrderActivity.fulfilled, (state, action) => {
        state.orderActivities.unshift(action.payload); // Add to beginning
      })
      .addCase(addOrderActivity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setCurrentOrderNumber,
  clearError,
  clearOrders,
  updateQuantityOptimistic,
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectOrderActivities = (state) => state.orders.orderActivities;
export const selectCurrentOrderNumber = (state) =>
  state.orders.currentOrderNumber;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectFetchingActivities = (state) =>
  state.orders.fetchingActivities;

// Get current order selector
export const selectCurrentOrder = (state) => {
  const currentOrderNumber = state.orders.currentOrderNumber;
  return state.orders.orders.find(
    (order) => order.order_number === currentOrderNumber
  );
};

// Calculate total amount selector
export const selectOrdersTotalAmount = (state) => {
  const currentOrder = selectCurrentOrder(state);
  if (!currentOrder?.order_items) return 0;

  return currentOrder.order_items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Get orders by status selector
export const selectOrdersByStatus = (state) => (status) => {
  return state.orders.orders.filter((order) => order.status === status);
};

// Get items count selector
export const selectOrderItemsCount = (state) => {
  const currentOrder = selectCurrentOrder(state);
  return currentOrder?.order_items?.length || 0;
};

export default ordersSlice.reducer;
