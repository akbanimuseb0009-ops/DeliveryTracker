import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getStatusColor } from '../../utils/helpers';
import { mockRoute } from '../../constants/mockRoute';
import { COLORS, CARD_STYLE } from '../../constants/theme';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const orders = useAppStore((s) => s.orders);
  const updateOrder = useAppStore((s) => s.updateOrder);
  const addTimelineEntry = useAppStore((s) => s.addTimelineEntry);
  const updateStatus = useAppStore((s) => s.updateStatus);
  const stopTracking = useAppStore((s) => s.stopTracking);
  const currentUser = useAuthStore((s) => s.currentUser);
  const order = orders.find((o) => o.id === orderId);
  const [isTracking, setIsTracking] = useState(false);
  // useRef for interval ID — never useState for interval IDs
  const intervalRef = useRef(null);
  // useRef to track current position in mock route
  const routeIndexRef = useRef(0);

  /** Starts GPS tracking simulation. Updates driverLocation every 5s cycling mockRoute. */
  const startTracking = () => {
    routeIndexRef.current = 0;
    setIsTracking(true);
    intervalRef.current = setInterval(() => {
      const location = mockRoute[routeIndexRef.current % mockRoute.length];
      updateOrder(orderId, {
        driverLocation: { ...location, updatedAt: new Date().toISOString() },
      });
      routeIndexRef.current += 1;
    }, 5000);
  };

  /** Stops tracking: clears interval, resets state, nullifies driverLocation. */
  const stopTrackingLocal = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsTracking(false);
    stopTracking(orderId);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}><Text>Order not found</Text></View>
      </SafeAreaView>
    );
  }

  const handlePickedUp = () => {
    updateStatus(orderId, 'Picked Up');
    addTimelineEntry(orderId, 'Picked Up', mockRoute[0]);
    startTracking();
  };
  const handleInTransit = () => {
    updateStatus(orderId, 'In Transit');
    addTimelineEntry(orderId, 'In Transit');
  };
  const handleDelivered = () => {
    stopTrackingLocal();
    updateStatus(orderId, 'Delivered');
    addTimelineEntry(orderId, 'Delivered');
    Alert.alert('Success', 'Order marked as Delivered!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const renderActionButton = () => {
    if (order.status === 'Accepted') return (
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.warning }]} onPress={handlePickedUp}>
        <Text style={styles.actionBtnText}>Mark as Picked Up</Text>
      </TouchableOpacity>
    );
    if (order.status === 'Picked Up') return (
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.purple }]} onPress={handleInTransit}>
        <Text style={styles.actionBtnText}>Mark as In Transit</Text>
      </TouchableOpacity>
    );
    if (order.status === 'In Transit') return (
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]} onPress={handleDelivered}>
        <Text style={styles.actionBtnText}>Mark as Delivered</Text>
      </TouchableOpacity>
    );
    if (order.status === 'Delivered') return (
      <View style={styles.deliveredCard}><Text style={styles.deliveredText}>✅ Order Successfully Delivered</Text></View>
    );
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.address}>📍 {order.address}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>📦 {order.item}</Text>
            <Text style={styles.detailText}>⚖️ {order.weight}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusBadgeText}>{order.status}</Text>
          </View>
        </View>
        {isTracking && (
          <View style={styles.trackingBadge}>
            <Text style={styles.trackingText}>📡 Live Tracking Active</Text>
          </View>
        )}
        {renderActionButton()}
        <Text style={styles.timelineHeader}>Order Timeline</Text>
        {order.timeline.map((entry, index) => {
          const isLast = index === order.timeline.length - 1;
          return (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, { backgroundColor: getStatusColor(entry.status) }]} />
                {!isLast && <View style={styles.line} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>{entry.status}</Text>
                <Text style={styles.timelineTime}>{new Date(entry.time).toLocaleString()}</Text>
                {entry.location && (
                  <Text style={styles.timelineLocation}>
                    📍 {entry.location.latitude.toFixed(4)}, {entry.location.longitude.toFixed(4)}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { ...CARD_STYLE },
  orderId: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 6 },
  customerName: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 4 },
  address: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailText: { fontSize: 14, color: COLORS.textSecondary },
  statusContainer: { alignItems: 'center', marginVertical: 16 },
  statusBadgeLarge: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  statusBadgeText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  trackingBadge: { backgroundColor: '#E8F5E9', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.success },
  trackingText: { color: COLORS.success, fontSize: 14, fontWeight: '600' },
  actionBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  deliveredCard: { backgroundColor: '#E8F5E9', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  deliveredText: { color: COLORS.success, fontSize: 16, fontWeight: '600' },
  timelineHeader: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  timelineRow: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', width: 40 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  line: { width: 2, flex: 1, minHeight: 30, backgroundColor: '#E0E0E0' },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineStatus: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  timelineTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  timelineLocation: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
});

export default OrderDetailScreen;
