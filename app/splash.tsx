import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const { isSignedIn, isLoaded } = useAuth();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const [localReady, setLocalReady] = useState(false);

  useEffect(() => {
    // Load local store once
    loadFromStorage().then(() => setLocalReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only run animation/navigation when both local store is ready and Clerk SDK is loaded
    if (!localReady || !isLoaded) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        // Use the latest auth state from Clerk and local store
        if (isSignedIn || isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }, 500);
    });
  }, [localReady, isLoaded, isSignedIn, isAuthenticated, animatedValue, scaleValue, router]);

  const opacityStyle = {
    opacity: animatedValue,
  };

  const scaleStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          opacityStyle,
          scaleStyle,
        ]}
      >
        {/* Logo Circle */}
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: Colors[theme].tint,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.logoText,
              { color: Colors[theme].background },
            ]}
          >
            QA
          </ThemedText>
        </View>

        {/* App Name */}
        <ThemedText style={styles.title}>QuizApp</ThemedText>
        <ThemedText
          style={[
            styles.subtitle,
            { color: Colors[theme].textSecondary },
          ]}
        >
          Master Your Knowledge
        </ThemedText>
      </Animated.View>

      {/* Bottom Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingIndicator,
          {
            opacity: animatedValue,
            backgroundColor: Colors[theme].tint,
          },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xxl,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: Spacing.xxl,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
