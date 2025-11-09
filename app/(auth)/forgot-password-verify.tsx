import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthInput } from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ForgotPasswordVerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { signIn, isLoaded } = useSignIn();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const validateCode = () => {
    if (!code) {
      setError('Verification code is required');
      return false;
    }
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return false;
    }
    setError('');
    return true;
  };

  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    if (!validateCode()) return;

    setLoading(true);
    try {
      if (!isLoaded || !signIn) return;

      // Attempt to verify the reset code
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
      });

      if (result.status === 'needs_new_password') {
        // Navigate to new password screen
        router.push({
          pathname: '/forgot-password-reset',
          params: { email },
        } as any);
      } else {
        setError('Invalid verification code');
      }
    } catch (err: any) {
      console.error('Verify code error:', err);
      const message =
        (err?.errors && err.errors[0]?.longMessage) ||
        err?.message ||
        'Invalid verification code. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      if (!isLoaded || !email) return;

      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email as string,
      });

      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
      setCode('');
      setError('');
    } catch (err: any) {
      console.error('Resend code error:', err);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
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
                name="mail-outline"
                size={48}
                color={themeColors.tint}
              />
            </View>
            <ThemedText style={styles.title}>Check Your Email</ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              We've sent a 6-digit verification code to
            </ThemedText>
            <ThemedText style={[styles.email, { color: themeColors.tint }]}>
              {email}
            </ThemedText>
          </View>

          {/* Form */}
          <GlassCard style={styles.formCard} intensity="medium" bordered>
            <AuthInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              error={error}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
              icon={
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={themeColors.tint}
                />
              }
            />

            <Button
              onPress={handleVerifyCode}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            >
              Verify Code
            </Button>
          </GlassCard>

          {/* Resend Code */}
          <GlassCard intensity="light" bordered style={styles.resendCard}>
            <ThemedText
              style={[styles.resendText, { color: themeColors.textSecondary }]}
            >
              Didn't receive the code?
            </ThemedText>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resending}
              style={styles.resendButton}
            >
              <ThemedText
                style={[
                  styles.resendLink,
                  { color: themeColors.tint, fontWeight: '600' },
                ]}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </ThemedText>
            </TouchableOpacity>
          </GlassCard>

          {/* Info */}
          <GlassCard intensity="light" bordered style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={20}
                color={themeColors.warning}
                style={styles.infoIcon}
              />
              <ThemedText
                style={[styles.infoText, { color: themeColors.textSecondary }]}
              >
                The verification code will expire in 10 minutes.
              </ThemedText>
            </View>
          </GlassCard>
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
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  resendCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resendText: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  resendButton: {
    paddingVertical: Spacing.sm,
  },
  resendLink: {
    fontSize: 15,
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
});
