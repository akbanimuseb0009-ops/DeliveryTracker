import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE } from '../../constants/theme';

const OpsDashboardScreen = ({ navigation }) => {
  const orders = useAppStore((s) => s.orders);

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => !['Open', 'Delivered'].includes(o.status)).length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.address}>📍 {item.address}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>📦 {item.item}</Text>
        <Text style={styles.detailText}>⚖️ {item.weight}</Text>
      </View>
      <Text style={styles.driverText}>
        {item.assignedDriverId ? `Driver: ${item.assignedDriverId}` : 'Unassigned'}
      </Text>
      {item.driverLocation && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>📍 Live Tracking</Text>
        </View>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.timelineBtn}
          onPress={() => navigation.navigate('OrderTimeline', { orderId: item.id })}
        >
          <Text style={styles.timelineBtnText}>📋 Timeline</Text>
        </TouchableOpacity>
        {item.driverLocation && (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate('DriverMap', { orderId: item.id })}
          >
            <Text style={styles.trackBtnText}>🗺 Track</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.statNumber}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.warning }]}>
              <Text style={styles.statNumber}>{activeOrders}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.success }]}>
              <Text style={styles.statNumber}>{deliveredOrders}</Text>
              <Text style={styles.statLabel}>Delivered</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, marginHorizontal: 4, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 13, color: '#FFF', marginTop: 4 },
  card: { ...CARD_STYLE },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  customerName: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 4 },
  address: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailText: { fontSize: 13, color: COLORS.textSecondary },
  driverText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', marginBottom: 8 },
  liveBadge: { backgroundColor: '#E8F5E9', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start', marginBottom: 10, borderWidth: 1, borderColor: COLORS.success },
  liveText: { color: COLORS.success, fontSize: 12, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  timelineBtn: { flex: 1, backgroundColor: COLORS.background, borderRadius: 8, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  timelineBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  trackBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  trackBtnText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
});

export default OpsDashboardScreen;
