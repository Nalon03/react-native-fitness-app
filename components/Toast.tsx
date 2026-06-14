import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = { message: string; type: 'success' | 'error'; visible: boolean };

export function Toast({ message, type, visible }: Props) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: visible ? 1 : 0, duration: 280, useNativeDriver: true }).start();
  }, [visible, message]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        type === 'error' ? styles.error : styles.success,
        { top: insets.top + 10, opacity: anim, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.icon}>{type === 'success' ? '✓' : '✕'}</Text>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  success: { backgroundColor: '#16a34a' },
  error: { backgroundColor: '#ef4444' },
  icon: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  text: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
});
