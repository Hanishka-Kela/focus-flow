/**
 * storage.ts
 * AsyncStorage helpers (Zustand persist handles most of it,
 * but these are available for direct one-off reads/writes)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('AsyncStorage write error:', e);
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn('AsyncStorage read error:', e);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('AsyncStorage remove error:', e);
  }
};
