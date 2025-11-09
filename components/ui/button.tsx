import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

export type ButtonProps = TouchableOpacityProps & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'small' | 'medium' | 'large';
  lightColor?: string;
  darkColor?: string;
  loading?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  lightColor,
  darkColor,
  loading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const textColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text');
  const surfaceColor = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'surface');

  const sizeMap = {
    small: { padding: Spacing.sm, fontSize: 14 },
    medium: { padding: Spacing.md, fontSize: 16 },
    large: { padding: Spacing.lg, fontSize: 18 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: tintColor,
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: surfaceColor,
      color: tintColor,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: tintColor,
      color: tintColor,
    },
    glass: {
      backgroundColor: surfaceColor,
      color: textColor,
      borderWidth: 1,
      borderColor: useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'surfaceHover'),
    },
  };

  const buttonVariant = variantStyles[variant];
  const sizeStyle = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          ...buttonVariant,
          opacity: disabled || loading ? 0.6 : 1,
          paddingVertical: sizeStyle.padding,
          paddingHorizontal: sizeStyle.padding,
        },
        variant !== 'glass' && Shadows.medium,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? tintColor : (variant === 'primary' ? '#FFFFFF' : textColor)} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyle.fontSize,
              color: variant === 'primary' ? '#FFFFFF' : buttonVariant.color,
              fontWeight: '600',
            },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontWeight: '600',
  },
});
