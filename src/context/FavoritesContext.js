import React, { createContext, useCallback, useContext, useEffect, useState} from 'react';
import { createFavorite, readFavorites, deleteFavorite} from '../services/favoritesDb';
import { loadFromCache, saveToCache, CACHE_KEYS } from '../storage/localCache';
import { isFirebaseConfigured } from '../config';

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState( [] );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateLocal = useCallback((newList) => {
        setFavorites(newList);
        saveToCache(CACHE_KEYS.favorites, newList);
    }, []);

    const refresh = useCallback( async () => {
        if (!isFirebaseConfigured) {
            setError('Firebase is not set up!!!');
            setIsLoading(false);
            return;
        }
        try {
            setError(null);
            const remoteList = await readFavorites();
            updateLocal(remoteList);
        } catch (e) {
            setError(`Could not reach the database: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [updateLocal]);

    useEffect(() => {
        async function loadOnStart() {
            const cached = await loadFromCache(CACHE_KEYS.favorites);
            if (cached) {
                setFavorites(cached);
                setIsLoading(false);
            }
            await refresh();
        }
        loadOnStart();
    }, [refresh]);

    const addFavorite = useCallback(
        async (picture) => {
            if (favorites.some((f) => f.nasaId === picture.nasaId)) {
                return true;
            }
            try {
                setError(null);
                const saved = await createFavorite(picture);
                updateLocal([saved, ...favorites]);
                return true;
            } catch (e) {
                setError(`Could not save: ${e.message}`);
                return false;
            }
        },
        [favorites, updateLocal]
    );

    const removeFavorite = useCallback(
        async (id) => {
            try {
                setError(null);
                await deleteFavorite(id);
                updateLocal(favorites.filter((f) => f.id !== id ));
                return true;
            } catch (e) {
                setError(`could not delete: ${e.message}`);
                return false;
            }
        },
        [favorites, updateLocal]    
    );

    const isFavorite = useCallback(
        (nasaId) => favorites.some((f) => f.nasaId === nasaId),
        [favorites]
    );

    const value = {
        favorites,
        isLoading,
        error,
        refresh,
        addFavorite,
        removeFavorite,
        isFavorite
    };

    return (
        <FavoritesContext.Provider value = {value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used inside <favoritesProvider>');
    }
    return context;
}