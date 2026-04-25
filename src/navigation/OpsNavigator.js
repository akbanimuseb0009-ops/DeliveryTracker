import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import OpsDashboardScreen from '../screens/ops/OpsDashboardScreen';
import OrderTimelineScreen from '../screens/ops/OrderTimelineScreen';
import DriverMapScreen from '../screens/ops/DriverMapScreen';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();

const OpsNavigator = () => {
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
        name="OpsDashboard"
        component={OpsDashboardScreen}
        options={{
          title: 'Operations Dashboard',
          headerRight: () => (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="OrderTimeline"
        component={OrderTimelineScreen}
        options={{ title: 'Order Timeline' }}
      />
      <Stack.Screen
        name="DriverMap"
        component={DriverMapScreen}
        options={{ title: 'Driver Location' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutBtn: { marginRight: 16, paddingVertical: 6, paddingHorizontal: 12 },
  logoutText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});

export default OpsNavigator;
