import { create } from 'zustand';
import { initialOrders } from '../constants/mockData';
import { mockRoute } from '../constants/mockRoute';

// Object to store interval IDs outside the store state to avoid serialization issues
const activeIntervals = {};

export const useAppStore = create((set, get) => ({
  orders: JSON.parse(JSON.stringify(initialOrders)),

  updateOrder: (orderId, changes) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...changes } : order
      ),
    }));
  },

  addTimelineEntry: (orderId, status, location = null) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              timeline: [
                ...order.timeline,
                { status, time: new Date().toISOString(), location },
              ],
            }
          : order
      ),
    }));
  },

  acceptOrder: (orderId, driverId) => {
    const { updateOrder, addTimelineEntry } = get();
    updateOrder(orderId, { status: 'Accepted', assignedDriverId: driverId });
    addTimelineEntry(orderId, 'Accepted');
  },

  updateStatus: (orderId, newStatus) => {
    const { updateOrder } = get();
    updateOrder(orderId, { status: newStatus });
  },

  startTracking: (orderId) => {
    const { updateOrder } = get();
    let routeIndex = 0;

    // Send initial location immediately
    updateOrder(orderId, {
      driverLocation: {
        ...mockRoute[0],
        updatedAt: new Date().toISOString(),
      },
    });
    routeIndex = 1;

    // Clear any existing interval for this order
    if (activeIntervals[orderId]) clearInterval(activeIntervals[orderId]);

    // Start background interval
    activeIntervals[orderId] = setInterval(() => {
      const location = mockRoute[routeIndex % mockRoute.length];
      updateOrder(orderId, {
        driverLocation: {
          ...location,
          updatedAt: new Date().toISOString(),
        },
      });
      routeIndex += 1;
    }, 3000);
  },

  stopTracking: (orderId) => {
    const { updateOrder } = get();
    if (activeIntervals[orderId]) {
      clearInterval(activeIntervals[orderId]);
      delete activeIntervals[orderId];
    }
    updateOrder(orderId, { driverLocation: null });
  },
}));
