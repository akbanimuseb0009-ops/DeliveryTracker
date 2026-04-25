import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import DriverOrdersScreen from '../screens/driver/DriverOrdersScreen';
import OrderDetailScreen from '../screens/driver/OrderDetailScreen';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();

const DriverNavigator = () => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="DriverOrders"
        component={DriverOrdersScreen}
        options={{
          title: 'My Orders',
          headerRight: () => (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutBtn: { marginRight: 16, paddingVertical: 6, paddingHorizontal: 12 },
  logoutText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});

export default DriverNavigator;
