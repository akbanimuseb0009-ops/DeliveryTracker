import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE, SHADOWS } from '../../constants/theme';
import ShipmentCard from '../../components/ShipmentCard';
import StatusBadge from '../../components/StatusBadge';

const DriverOrdersScreen = ({ navigation }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const orders = useAppStore((state) => state.orders);
  const acceptOrder = useAppStore((state) => state.acceptOrder);

  // Filter orders into sections
  const myOrders = orders.filter(
    (o) => o.assignedDriverId === currentUser.id && o.status !== 'Delivered'
  );
  const openOrders = orders.filter(
    (o) => o.status === 'Open' && o.assignedDriverId === null
  );
  const deliveredOrders = orders.filter(
    (o) => o.assignedDriverId === currentUser.id && o.status === 'Delivered'
  );

  // Build combined list data with section headers
  const listData = [];
  if (myOrders.length > 0) {
    listData.push({ type: 'section', title: 'Active Shipments' });
    myOrders.forEach(o => listData.push({ type: 'order', ...o }));
  }
  if (openOrders.length > 0) {
    listData.push({ type: 'section', title: 'Available in Region' });
    openOrders.forEach(o => listData.push({ type: 'order', ...o }));
  }
  if (deliveredOrders.length > 0) {
    listData.push({ type: 'section', title: 'Completed Tasks' });
    deliveredOrders.forEach(o => listData.push({ type: 'order', ...o }));
  }

  const handleAccept = (orderId) => {
    acceptOrder(orderId, currentUser.id);
    Alert.alert('Success', 'Shipment assigned to your dashboard.');
  };

  const renderItem = ({ item }) => {
    if (item.type === 'section') {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }

    const isDelivered = item.status === 'Delivered';
    const isOpen = item.status === 'Open' && !item.assignedDriverId;

    return (
      <ShipmentCard
        order={item}
        onPress={() => !isOpen && navigation.navigate('OrderDetail', { orderId: item.id })}
        icon={
          <Ionicons 
            name={isDelivered ? "checkmark-circle" : "cube-outline"} 
            size={24} 
            color={isDelivered ? COLORS.success : COLORS.primary} 
          />
        }
      >
        {isOpen && (
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
            <Text style={styles.acceptButtonText}>Accept Shipment</Text>
          </TouchableOpacity>
        )}
      </ShipmentCard>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Monitor and manage logistics</Text>
        </View>

        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.type === 'section' ? `section-${index}` : item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={48} color={COLORS.grey} />
              <Text style={styles.emptyText}>No shipments found for your region.</Text>
            </View>
          )}
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  orderCard: {
    ...CARD_STYLE,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  deliveredCard: {
    opacity: 0.8,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderInfo: { flex: 1 },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default DriverOrdersScreen;
