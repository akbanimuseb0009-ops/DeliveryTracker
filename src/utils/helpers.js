/**
 * Returns a color corresponding to the given order status.
 * Used across all screens for consistent status badge coloring.
 */
export const getStatusColor = (status) => {
  const colors = {
    'Open': '#9E9E9E',
    'Accepted': '#2196F3',
    'Picked Up': '#FF9800',
    'In Transit': '#9C27B0',
    'Delivered': '#4CAF50',
    'Order Created': '#607D8B',
  };
  return colors[status] || '#9E9E9E';
};
