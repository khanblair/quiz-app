import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';
import { ThemedText } from '../themed-text';

export type AuthInputProps = TextInputProps & {
  label?: string;
  lightColor?: string;
  darkColor?: string;
  error?: string;
  icon?: React.ReactNode;
};

export function AuthInput({
  label,
  lightColor,
  darkColor,
  error,
  icon,
  style,
  ...props
}: AuthInputProps) {
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const [isFocused, setIsFocused] = useState(false);
  
  const textColor = useThemeColor({ light: '#1F2937', dark: '#F3F4F6' }, 'text');
  const backgroundColor = useThemeColor(
    { light: '#F9FAFB', dark: '#111827' },
    'background'
  );
  const placeholderColor = useThemeColor(
    { light: '#9CA3AF', dark: '#6B7280' },
    'textSecondary'
  );
  
  const borderColor = error
    ? themeColors.error
    : isFocused
    ? themeColors.tint
    : theme === 'dark' ? '#374151' : '#E5E7EB';

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[styles.label, { color: themeColors.text }]}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              paddingLeft: icon ? Spacing.sm : Spacing.md,
            },
            style,
          ]}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={[styles.error, { color: themeColors.error }]}>
            {error}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
  },
  errorContainer: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  error: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
