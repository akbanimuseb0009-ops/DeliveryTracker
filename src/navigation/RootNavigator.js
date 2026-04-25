import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import DriverNavigator from './DriverNavigator';
import OpsNavigator from './OpsNavigator';

const Stack = createStackNavigator();

/**
 * RootNavigator handles auth flow via conditional rendering:
 * - isLoading true  → LoadingScreen (AsyncStorage check in progress)
 * - currentUser set → DriverNavigator or OpsNavigator based on role
 * - no user         → LoginScreen
 * 
 * No navigation.navigate() needed for auth — state changes trigger re-render.
 */
const RootNavigator = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isLoading = useAuthStore((s) => s.isLoading);

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : currentUser ? (
        currentUser.role === 'driver' ? (
          <DriverNavigator />
        ) : (
          <OpsNavigator />
        )
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
