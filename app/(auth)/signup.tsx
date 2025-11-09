import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthInput } from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';
import { useOAuth, useSignUp } from '@clerk/clerk-expo';
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

export default function SignupScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { setUser } = useAuthStore();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!isLoaded) return;
  if (!signUp) return;
  await signUp.create({ emailAddress: email, password });
  await signUp.update({ firstName: name });
  await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerificationStep(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error?.errors?.[0]?.longMessage || 'Signup failed. Please try again.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setErrors({ email: 'Verification code is required' });
      return;
    }
    setLoading(true);
    try {
      if (!signUp) return;
      const attempt = await signUp.attemptEmailAddressVerification({ code: verificationCode.trim() });
      if (attempt.status === 'complete') {
        await setActive?.({ session: attempt.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setErrors({ email: 'Invalid code. Please try again.' });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const message = error?.errors?.[0]?.longMessage || 'Verification failed. Please try again.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive: setActiveOAuth, signIn: si, signUp: su } = await startOAuthFlow();
      if (createdSessionId) {
        await setActiveOAuth?.({ session: createdSessionId });
        router.replace('/(tabs)');
        return;
      }
      if (si || su) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      Alert.alert('Google Sign-Up failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const themeColors = Colors[theme];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: themeColors.tint },
              ]}
            >
              <ThemedText
                style={[
                  styles.logoText,
                  { color: themeColors.background },
                ]}
              >
                QA
              </ThemedText>
            </View>
            <ThemedText style={styles.welcomeTitle}>Create Account</ThemedText>
            <ThemedText
              style={[
                styles.welcomeSubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              Join our learning community
            </ThemedText>
          </View>

          {/* Form Card */}
          <GlassCard style={styles.formCard} intensity="medium" bordered>
            {!verificationStep ? (
              <>
                <AuthInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                  editable={!loading}
                  icon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={themeColors.tint}
                    />
                  }
                />

                <AuthInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
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

                <AuthInput
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  icon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={themeColors.tint}
                      />
                    </TouchableOpacity>
                  }
                />

                <AuthInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={errors.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  icon={
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                        }
                        size={20}
                        color={themeColors.tint}
                      />
                    </TouchableOpacity>
                  }
                />

                <Button
                  onPress={handleSignup}
                  loading={loading}
                  variant="primary"
                  size="large"
                  style={styles.signupButton}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <AuthInput
                  label="Verification Code"
                  placeholder="Enter the 6-digit code"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  error={errors.email}
                  keyboardType="number-pad"
                  editable={!loading}
                  icon={
                    <Ionicons name="key-outline" size={20} color={themeColors.tint} />
                  }
                />
                <Button
                  onPress={handleVerifyEmail}
                  loading={loading}
                  variant="primary"
                  size="large"
                  style={styles.signupButton}
                >
                  Verify Email
                </Button>
              </>
            )}
          </GlassCard>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View
              style={[
                styles.divider,
                { backgroundColor: themeColors.textSecondary },
              ]}
            />
            <ThemedText
              style={[
                styles.dividerText,
                { color: themeColors.textSecondary },
              ]}
            >
              Or sign up with
            </ThemedText>
            <View
              style={[
                styles.divider,
                { backgroundColor: themeColors.textSecondary },
              ]}
            />
          </View>

          {/* Social Signup */}
          <Button
            onPress={handleGoogleSignup}
            variant="outline"
            size="large"
            style={styles.googleButton}
          >
            <Ionicons name="logo-google" size={20} color={themeColors.tint} />
            <ThemedText
              style={[
                { marginLeft: Spacing.md, color: themeColors.tint },
              ]}
            >
              Google
            </ThemedText>
          </Button>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <ThemedText style={{ color: themeColors.textSecondary }}>
              Already have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  signupButton: {
    marginTop: Spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
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
