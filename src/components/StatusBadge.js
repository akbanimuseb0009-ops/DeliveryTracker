import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  text: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default StatusBadge;
