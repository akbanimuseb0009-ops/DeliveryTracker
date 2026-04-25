import { create } from 'zustand';
import { initialOrders } from '../constants/mockData';

export const useAppStore = create((set, get) => ({
  // Deep copy so mock data is never mutated
  orders: JSON.parse(JSON.stringify(initialOrders)),

  /**
   * Merges `changes` into the order matching `orderId`.
   * Uses immutable map + spread pattern.
   */
  updateOrder: (orderId, changes) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...changes } : order
      ),
    }));
  },

  /**
   * Appends a new timeline entry to the specified order.
   * Uses immutable map + spread to avoid direct mutation.
   */
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

  /**
   * Accepts an order: sets status to 'Accepted', assigns the driver,
   * and adds a timeline entry.
   */
  acceptOrder: (orderId, driverId) => {
    const { updateOrder, addTimelineEntry } = get();
    updateOrder(orderId, { status: 'Accepted', assignedDriverId: driverId });
    addTimelineEntry(orderId, 'Accepted');
  },

  /**
   * Updates just the status field of an order.
   */
  updateStatus: (orderId, newStatus) => {
    const { updateOrder } = get();
    updateOrder(orderId, { status: newStatus });
  },

  /**
   * Clears the driverLocation for an order (called when tracking stops).
   */
  stopTracking: (orderId) => {
    const { updateOrder } = get();
    updateOrder(orderId, { driverLocation: null });
  },
}));
