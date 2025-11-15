import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NotificationBellProps {
  count: number;
  onPress: () => void;
}

export function NotificationBell({ count, onPress }: NotificationBellProps) {
  const theme = useAppTheme();
  const themeColors = Colors[theme];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={24} color={themeColors.text} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: themeColors.error }]}>
          <ThemedText style={styles.badgeText}>
            {count > 99 ? '99+' : count}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
