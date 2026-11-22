import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import PictureCard from '../components/PictureCard';
import StatusMessage from '../components/StatusMessage';
import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme';

export default function FavoritesScreen() {
    const { favorites, isLoading, error, refresh, removeFavorite} = useFavorites();
    const [isRefreshing, setIsRefreshing] = useState(false);

    async function handleRefresh() {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    }
    if (isLoading) return <StatusMessage loading message = "Loading favorites..." />

    return (
        <FlatList
        style = {styles.screen}
        contentContainerStyle = {styles.content}
        data = {favorites}
        keyExtractor = {(item) => item.id}
        ListHeaderComponent = {
            error ? <Text style = {styles.error}>{error}</Text> : null
        }
        ListEmptyComponent = {
            <Text style = {styles.empty}>
                No favorites yet. Search for a picture and tap "Save to favorites"!
            </Text>
        }
        refreshControl = {
            <RefreshControl
            refreshing = {isRefreshing}
            onRefresh = {handleRefresh}
            tintColor = {colors.accent}
            />
        }
        renderItem = {({ item }) => (
            <PictureCard
            picture = {item}
            buttonLabel = 'Delete'
            danger
            onPressButton = {() => removeFavorite(item.id)}
            />
        )}
        />
    );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, flexGrow: 1 },
  error: { color: colors.danger, marginBottom: 12, textAlign: 'center' },
  empty: { color: colors.mutedText, textAlign: 'center', marginTop: 40 },
});
