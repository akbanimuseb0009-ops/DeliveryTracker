import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getStatusColor } from '../../utils/helpers';
import { COLORS, CARD_STYLE, SHADOWS } from '../../constants/theme';

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

  // Build combined list with section headers
  const buildListData = () => {
    const data = [];
    if (myOrders.length > 0) {
      data.push({ type: 'header', title: `My Active Orders (${myOrders.length})` });
      myOrders.forEach((o) => data.push({ type: 'active', ...o }));
    }
    if (openOrders.length > 0) {
      data.push({ type: 'header', title: `Available Orders (${openOrders.length})` });
      openOrders.forEach((o) => data.push({ type: 'open', ...o }));
    }
    if (deliveredOrders.length > 0) {
      data.push({ type: 'header', title: `Delivered (${deliveredOrders.length})` });
      deliveredOrders.forEach((o) => data.push({ type: 'delivered', ...o }));
    }
    return data;
  };

  const listData = buildListData();

  const handleAccept = (orderId) => {
    acceptOrder(orderId, currentUser.id);
    Alert.alert('Order Accepted!', 'This order has been assigned to you.');
  };

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }

    const isDelivered = item.type === 'delivered';

    return (
      <View style={[styles.card, isDelivered && styles.deliveredCard]}>
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

        {item.type === 'open' && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept Order</Text>
          </TouchableOpacity>
        )}

        {item.type === 'active' && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        )}

        {isDelivered && (
          <Text style={styles.deliveredText}>✅ Delivered</Text>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyText}>No orders available</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${index}` : item.id
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    ...CARD_STYLE,
  },
  deliveredCard: {
    backgroundColor: '#F5F5F5',
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deliveredText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default DriverOrdersScreen;
