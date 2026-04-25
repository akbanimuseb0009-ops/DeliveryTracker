import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CARD_STYLE, SHADOWS } from '../constants/theme';
import StatusBadge from './StatusBadge';

const ShipmentCard = ({ order, onPress, children, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.card, order.status === 'Delivered' && styles.deliveredCard]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.contentRow}>
        {icon && (
          <View style={styles.orderIcon}>
            {icon}
          </View>
        )}
        <View style={styles.mainContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <StatusBadge status={order.status} />
          </View>
          
          <Text style={styles.customer}>{order.customerName}</Text>
          
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>{order.address}</Text>
          </View>
          
          {children}
        </View>

        {onPress && order.status !== 'Delivered' && (
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD_STYLE,
    padding: 16,
    marginBottom: 12,
  },
  deliveredCard: {
    opacity: 0.8,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  mainContent: {
    flex: 1,
  },
  chevronContainer: {
    paddingLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  customer: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
});

export default ShipmentCard;
