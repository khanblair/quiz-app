import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthInput } from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { signIn, isLoaded } = useSignIn();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendCode = async () => {
    Keyboard.dismiss();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      if (!isLoaded) return;

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      // Navigate to verification screen with email
      router.push({
        pathname: '/forgot-password-verify',
        params: { email },
      } as any);
    } catch (err: any) {
      console.error('Send code error:', err);
      const message =
        (err?.errors && err.errors[0]?.longMessage) ||
        err?.message ||
        'Failed to send verification code. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={themeColors.tint} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: themeColors.tint + '20' },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={48}
                color={themeColors.tint}
              />
            </View>
            <ThemedText style={styles.title}>Forgot Password?</ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              Enter your email address and we'll send you a code to reset your
              password.
            </ThemedText>
          </View>

          {/* Form */}
          <GlassCard style={styles.formCard} intensity="medium" bordered>
            <AuthInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              icon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={themeColors.tint}
                />
              }
            />

            <Button
              onPress={handleSendCode}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            >
              Send Verification Code
            </Button>
          </GlassCard>

          {/* Info Card */}
          <GlassCard intensity="light" bordered style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={themeColors.tint}
                style={styles.infoIcon}
              />
              <ThemedText
                style={[styles.infoText, { color: themeColors.textSecondary }]}
              >
                You'll receive a 6-digit verification code to reset your
                password. The code expires in 10 minutes.
              </ThemedText>
            </View>
          </GlassCard>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <ThemedText style={{ color: themeColors.textSecondary }}>
              Remember your password?{' '}
            </ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText
                style={[
                  styles.loginLink,
                  { color: themeColors.tint, fontWeight: '600' },
                ]}
              >
                Sign In
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  infoCard: {
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    marginLeft: Spacing.sm,
  },
});
