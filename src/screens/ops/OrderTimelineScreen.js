import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE } from '../../constants/theme';

const OrderTimelineScreen = ({ route }) => {
  const { orderId } = route.params;
  const orders = useAppStore((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}><Text>Order not found</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.address}>📍 {order.address}</Text>
        </View>

        {/* Timeline Section */}
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
                <Text style={styles.entryStatus}>{entry.status}</Text>
                <Text style={styles.entryTime}>{new Date(entry.time).toLocaleString()}</Text>
                {entry.location && (
                  <Text style={styles.entryLocation}>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  customerName: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 4 },
  address: { fontSize: 14, color: COLORS.textSecondary },
  timelineHeader: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8, marginBottom: 16 },
  timelineRow: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', width: 40 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  line: { width: 2, flex: 1, minHeight: 30, backgroundColor: '#E0E0E0' },
  timelineContent: { flex: 1, paddingBottom: 20 },
  entryStatus: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  entryTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  entryLocation: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
});

export default OrderTimelineScreen;
