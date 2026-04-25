import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE } from '../../constants/theme';

const OrderTimelineScreen = ({ route }) => {
  const { orderId } = route.params;
  const orders = useAppStore((state) => state.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shipment Journey</Text>
          <Text style={styles.headerSubtitle}>Tracking ID: {order.id}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.customerIcon}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Text style={styles.customerLabel}>Customer</Text>
            </View>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {order.timeline.map((entry, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.node, { backgroundColor: getStatusColor(entry.status) }]}>
                  <Ionicons 
                    name={index === 0 ? "flag" : "checkmark"} 
                    size={12} 
                    color="#FFF" 
                  />
                </View>
                {index !== order.timeline.length - 1 && <View style={styles.line} />}
              </View>
              
              <View style={styles.timelineRight}>
                <View style={styles.timelineContent}>
                  <Text style={styles.statusText}>{entry.status}</Text>
                  <Text style={styles.timeText}>
                    {new Date(entry.time).toLocaleDateString()} • {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {entry.location && (
                    <View style={styles.locationBox}>
                      <Ionicons name="pin" size={12} color={COLORS.textSecondary} />
                      <Text style={styles.locationText}>
                        Lat: {entry.location.latitude.toFixed(4)}, Lng: {entry.location.longitude.toFixed(4)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    ...CARD_STYLE,
    padding: 16,
    marginBottom: 32,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  customerLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timelineContainer: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 32,
  },
  timelineContent: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default OrderTimelineScreen;
