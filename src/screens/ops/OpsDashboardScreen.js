import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE, SHADOWS } from '../../constants/theme';
import ShipmentCard from '../../components/ShipmentCard';
import StatusBadge from '../../components/StatusBadge';

const OpsDashboardScreen = ({ navigation }) => {
  const orders = useAppStore((state) => state.orders);

  // KPIs
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Open').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const renderItem = ({ item }) => (
    <ShipmentCard order={item}>
      {item.driverLocation && (
        <View style={styles.trackingBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.trackingText}>Live Tracking Active</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={[styles.footerBtn, { backgroundColor: '#F1F5F9' }]}
          onPress={() => navigation.navigate('OrderTimeline', { orderId: item.id })}
        >
          <Ionicons name="time-outline" size={16} color={COLORS.textPrimary} />
          <Text style={styles.footerBtnText}>Timeline</Text>
        </TouchableOpacity>

        {item.driverLocation && (
          <TouchableOpacity 
            style={[styles.footerBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('DriverMap', { orderId: item.id })}
          >
            <Ionicons name="map-outline" size={16} color="#FFF" />
            <Text style={[styles.footerBtnText, { color: '#FFF' }]}>Live Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </ShipmentCard>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ops Center</Text>
          <Text style={styles.headerSubtitle}>Real-time supply chain monitoring</Text>
        </View>

        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#E0E7FF' }]}>
                    <Ionicons name="cube" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.statValue}>{totalOrders}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="flash" size={18} color={COLORS.warning} />
                  </View>
                  <Text style={styles.statValue}>{activeOrders}</Text>
                  <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="checkmark-done" size={18} color={COLORS.success} />
                  </View>
                  <Text style={styles.statValue}>{deliveredOrders}</Text>
                  <Text style={styles.statLabel}>Done</Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>Global Shipments</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  trackingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.success,
    textTransform: 'uppercase',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    color: COLORS.textPrimary,
  },
});

export default OpsDashboardScreen;
