import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
    StyleSheet,
    View,
    ViewProps,
} from 'react-native';

export type GlassCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  intensity?: 'light' | 'medium' | 'strong';
  bordered?: boolean;
};

export function GlassCard({
  style,
  lightColor,
  darkColor,
  intensity = 'medium',
  bordered = true,
  children,
  ...otherProps
}: GlassCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor || '#FFFFFF', dark: darkColor || '#1F2937' },
    'surface'
  );

  const borderColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'surfaceHover'
  );

  // Elevation based on intensity
  const elevationMap = {
    light: Shadows.small,
    medium: Shadows.medium,
    strong: Shadows.large,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
        bordered && styles.bordered,
        elevationMap[intensity],
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  bordered: {
    borderWidth: 1,
  },
});
