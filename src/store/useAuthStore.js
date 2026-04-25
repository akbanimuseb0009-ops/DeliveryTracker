import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS = [
  { email: 'driver@test.com', password: '123456', role: 'driver', id: 'DRV001', name: 'Ravi Kumar' },
  { email: 'ops@test.com',    password: '123456', role: 'ops',    id: 'OPS001', name: 'Operations Admin' }
];

const STORAGE_KEY = '@delivery_tracker_user';

export const useAuthStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  authError: '',

  /**
   * Validates credentials, saves session to AsyncStorage on success.
   * Returns true if login succeeded, false otherwise.
   */
  login: async (email, password) => {
    const match = CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );

    if (!match) {
      set({ authError: 'Invalid email or password' });
      return false;
    }

    const user = { email: match.email, role: match.role, id: match.id, name: match.name };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ currentUser: user, authError: '' });
    return true;
  },

  /**
   * Clears session from AsyncStorage and resets currentUser to null.
   * RootNavigator handles redirect back to LoginScreen automatically.
   */
  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ currentUser: null });
  },

  /**
   * Called ONCE on app start (App.js useEffect).
   * Checks AsyncStorage for a saved session and restores it.
   * Sets isLoading to false when done so the loading screen disappears.
   */
  loadStoredUser: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ currentUser: JSON.parse(stored) });
      }
    } catch (e) {
      console.log('Failed to load stored user:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
