import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme';

export default function PictureCard({
    picture,
    buttonLabel,
    buttonDisabled = false,
    onPressButton,
    danger = false,    
}) {
    const [isWorking, setIsWorking] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    async function handlePress() {
        setIsWorking(true);
        await onPressButton();
        setIsWorking(false);        
    }

    const aspectRatio = Math.min(Math.max(picture.aspectRatio || 4 / 3, 0.75), 2);

    return (
        <View style = {styles.card}>
            <Image source = {{ uri: picture.url }} style = {[styles.image, {aspectRatio}]} resizeMode = "cover" />

            <View style = {styles.body}>
                <Text style = {styles.title}>{picture.title}</Text>
                <Text style = {styles.meta}>
                    {picture.date}
                    {picture.credit ? `  ·  ${picture.credit}` : ''}

                </Text>

                {picture.description ? (
                  <Pressable onPress={() => setIsExpanded(!isExpanded)}>
                    <Text style = {styles.description} numberOfLines={isExpanded ? undefined : 3}>{picture.description}</Text>
                    <Text style={styles.more}>{isExpanded ? 'Show less' : 'Show more'}</Text>
                    </Pressable>
                ): null}

                {onPressButton && (
                    <Pressable
                        onPress = {handlePress}
                        disabled = {buttonDisabled || isWorking}
                        style = {({ pressed }) => [
                            styles.button,
                            danger && styles.buttonDanger,
                            (buttonDisabled || isWorking) && styles.buttonDisabled,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        {isWorking ? (
                            <ActivityIndicator color = "#fff" />
                        ) : (
                            <Text style = {styles.buttonText}>{buttonLabel}</Text>
                        )}
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden', 
    marginBottom: 16,
  },
  image: {
    width: '100%',
    backgroundColor: '#000',
  },
  body: {
    padding: 14,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.mutedText,
    marginTop: 4,
    fontSize: 13,
  },
  description: {
    color: colors.text,
    marginTop: 10,
    lineHeight: 21,
  },
  more: {
    color: colors.accent,
    marginTop: 10,
    lineHeight: 21,
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
