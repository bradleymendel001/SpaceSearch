import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PictureCard from '../components/PictureCard';
import StatusMessage from '../components/StatusMessage';
import { searchPictures, randomTopic, SUGGESTED_TOPICS } from '../services/nasaImages';
import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme';

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [pictures, setPictures] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const { addFavorite, isFavorite } = useFavorites();

    const latestSearchId = useRef(0);

    const runSearch = useCallback(async (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const searchId = ++latestSearchId.current;
        setActiveQuery(trimmed);
        setError(null);

        try {
            const result = await searchPictures(trimmed, 1);
            if (searchId !== latestSearchId.current) return;
            setPictures(result.pictures);
            setHasMore(result.hasMore);
            setPage(1);
        } catch (e) {
            if (searchId !== latestSearchId.current) return;
            setError(`Could not load pictures: ${e.message}`);
        }
    }, []);

    useEffect(() => {
        async function loadOnStart() {
            const topic = randomTopic();
            setSearchText(topic);
            await runSearch(topic);
            setIsLoading(false);
        }
        loadOnStart();
    }, [runSearch]);
    async function handleSearch(query) {
        setSearchText(query);
        setIsLoading(true);
        await runSearch(query);
        setIsLoading(false);
    }

    async function handleRefresh() {
        setIsRefreshing(true);
        await runSearch(activeQuery);
        setIsRefreshing(false);
    }

    async function handleLoadMore() {
        if (!hasMore || isLoadingMore || isLoading) return;

        const searchId = latestSearchId.current;
        const nextPage = page + 1;
        setIsLoadingMore(true);

        try {
            const result = await searchPictures(activeQuery, nextPage);
            if (searchId === latestSearchId.current) {
                setPictures((current) => {
                    const seen = new Set(current.map((p) => p.nasaId));
                    return [...current, ...result.pictures.filter((p) => !seen.has(p.nasaId))];
                });
                setHasMore(result.hasMore);
                setPage(nextPage);
            }
        } catch (e) {
            setError(`Could not load more: ${e.message}`);
        } finally {
            setIsLoadingMore(false);
        }
    }

    return (
        <View style={styles.screen}>
            <View style = {styles.searchArea}>
                <View style = {styles.searchBar}>
                    <Ionicons name="search" size={18} color = {colors.mutedText} />
                    <TextInput
                    style={styles.input}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => handleSearch(searchText)}
                    placeholder='Search NASA Pictures'
                    placeholderTextColor={colors.mutedText}
                    returnKeyType='search'
                    autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <Pressable onPress={() => setSearchText('')} hitSlop={10}>
                            <Ionicons name='close-circle' size={18} color={colors.mutedText} />
                        </Pressable>
                    )}
                </View>
                <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.topics}
                >
                    {SUGGESTED_TOPICS.map((topic) => (
                        <Pressable
                        key={topic}
                        onPress={() => handleSearch(topic)}
                        style={[styles.topic, topic === activeQuery && styles.topicActive]}
                        >
                            <Text style={styles.topicText}>{topic}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            {isLoading ? (
                <StatusMessage loading message="Searching the cosmos..." />
            ) : error && pictures.length === 0 ? (
                <StatusMessage message={error} />
            ) : (
                <FlatList
                style = {styles.list}
                contentContainerStyle={styles.listContent}
                data={pictures}
                keyExtractor={(item) => item.nasaId}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                onEndReached={handleLoadMore}
                ListHeaderComponent={
                    error ? <Text style={styles.error}>{error}</Text> : null
                }
                ListEmptyComponent={
                    <Text style={styles.hint}>No pictures found for "{activeQuery}".</Text>
                }
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator color={colors.accent} style={styles.footer} />
                    ) : null
                }
                refreshControl={
                    <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={colors.accent}
                    />
                }
                renderItem={({ item }) => {
                    const alreadySaved = isFavorite(item.nasaId);
                    return (
                        <PictureCard
                        picture={item}
                        buttonLabel={alreadySaved ? 'Saved' : 'Save to favorites'}
                        buttonDisabled={alreadySaved}
                        onPressButton={() => addFavorite(item)}
                        />
                    );
                }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchArea: { paddingTop: 12, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.input,
  },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 10 },
  topics: { gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  topic: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  topicActive: { backgroundColor: colors.accent },
  topicText: { color: colors.text, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: 16, paddingTop: 4 },
  hint: { color: colors.mutedText, textAlign: 'center', marginTop: 40 },
  error: { color: colors.danger, marginBottom: 12, textAlign: 'center' },
  footer: { marginVertical: 16 },
});