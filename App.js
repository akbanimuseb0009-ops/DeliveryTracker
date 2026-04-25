import { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { useAuthStore } from './src/store/useAuthStore';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  const loadStoredUser = useAuthStore(state => state.loadStoredUser);

  useEffect(() => {
    loadStoredUser(); // Check AsyncStorage once on mount
  }, []);

  return <RootNavigator />;
}

registerRootComponent(App);
