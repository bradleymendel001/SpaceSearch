import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadFromCache(key) {
    try {
        const text = await AsyncStorage.getItem(key);
        return text === null ? null : JSON.parse(text);
    } catch (error) {
        console.warn(`Could not read "${key}" from local cache`, error);
        return null;
    }
}

export async function saveToCache(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Could not write "${key}" to local cache`, error);
    }
}

export const CACHE_KEYS = {
    favorites: 'favorites'
};