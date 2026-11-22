import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function StatusMessage({ loading = false, message }) {
    return (
        <View style = {styles.container}>
            {loading && <ActivityIndicator size = "large" color = {colors.accent} />}
            {message ? <Text style = {styles.text}>{message}</Text> : null }
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.mutedText,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 15,
  },
});