import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AUTO_NAVIGATION_DELAY = 1800;

export default function OAuthCallbackScreen() {
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isLoaded, isSignedIn } = useAuth();

  // Support common redirect parameters
  const fallbackPath =
    (typeof params?.next === 'string' && params.next) ||
    (typeof params?.redirect === 'string' && params.redirect) ||
    (typeof params?.redirect_uri === 'string' && params.redirect_uri) ||
    undefined;

  // Clerk may return a `state` param which can be an encoded JSON containing a redirect.
  let stateRedirect: string | undefined;
  try {
    const rawState = typeof params?.state === 'string' ? params.state : undefined;
    if (rawState) {
      const decoded = decodeURIComponent(rawState);
      const parsed = JSON.parse(decoded);
      stateRedirect = parsed?.next || parsed?.redirect || parsed?.redirect_uri;
    }
  } catch (e) {
    // ignore parse errors; state may be opaque
  }

  const finalDestination = stateRedirect || fallbackPath || (isSignedIn ? '/(tabs)' : '/(auth)/login');

  const errorMessage =
    (typeof params?.error_description === 'string' && params.error_description) ||
    (typeof params?.error === 'string' && params.error);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const timer = setTimeout(() => {
      router.replace(finalDestination as any);
    }, AUTO_NAVIGATION_DELAY);
    return () => clearTimeout(timer);
  }, [isLoaded, finalDestination, router]);

  const handleContinue = () => {
    router.replace(finalDestination as any);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="sync" size={48} color={themeColors.tint} />
          </View>
          <ThemedText
            style={[styles.title, { color: themeColors.text }]}
            numberOfLines={2}
          >
            Completing authentication…
          </ThemedText>
          <ThemedText
            style={[
              styles.message,
              errorMessage
                ? { color: themeColors.warning }
                : { color: themeColors.textSecondary },
            ]}
          >
            {errorMessage
              ? errorMessage
              : 'Please wait while we finish signing you in.'}
          </ThemedText>
          <ActivityIndicator
            size="large"
            color={themeColors.tint}
            style={styles.spinner}
          />
          <Button onPress={handleContinue} variant="outline" size="large">
            Continue
          </Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    borderRadius: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  spinner: {
    marginBottom: Spacing.lg,
  },
});
