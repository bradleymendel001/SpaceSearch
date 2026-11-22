import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { FavoritesProvider, useFavorites } from './src/context/FavoritesContext';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Search: 'telescope',
    Favorites: 'heart',
};

const navigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.card,
        primary: colors.accent,
        text: colors.text,
    },
};

function Tabs() {
    const { favorites } = useFavorites();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    const base = TAB_ICONS[route.name];
                    const name = focused ? base : `${base}-outline`;
                    return<Ionicons name={name} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.mutedText,
            })}
        >
            <Tab.Screen
                name = "Search"
                component = {SearchScreen}
                options = {{title: 'Space Search'}}
            />
            <Tab.Screen
                name = "Favorites"
                component = {FavoritesScreen}
                options = {{ tabBarBadge: favorites.length > 0 ? favorites.length : undefined }}
            />
            </Tab.Navigator>
    );
    
}

export default function App() {
    return (
        <FavoritesProvider>
            <NavigationContainer theme = {navigationTheme}>
                <Tabs />
                <StatusBar style = "light" />
            </NavigationContainer>
        </FavoritesProvider>
    );
}