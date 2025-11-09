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

export default function ForgotPasswordResetScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { signIn, setActive, isLoaded } = useSignIn();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!isLoaded || !signIn) return;

      // Reset the password
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === 'complete') {
        // Sign in with the new password
        await setActive?.({ session: result.createdSessionId });
        
        Alert.alert(
          'Success!',
          'Your password has been reset successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      const message =
        (err?.errors && err.errors[0]?.longMessage) ||
        err?.message ||
        'Failed to reset password. Please try again.';
      setErrors({ password: message });
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: themeColors.textSecondary, width: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { text: 'Weak', color: themeColors.error, width: 33 };
    if (strength <= 3) return { text: 'Medium', color: themeColors.warning, width: 66 };
    return { text: 'Strong', color: themeColors.success, width: 100 };
  };

  const passwordStrength = getPasswordStrength();

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
                styles.iconContainer,
                { backgroundColor: themeColors.success + '20' },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color={themeColors.success}
              />
            </View>
            <ThemedText style={styles.title}>Create New Password</ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              Your new password must be different from previously used passwords.
            </ThemedText>
          </View>

          {/* Form */}
          <GlassCard style={styles.formCard} intensity="medium" bordered>
            <AuthInput
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPassword}
              editable={!loading}
              icon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={themeColors.tint}
                  />
                </TouchableOpacity>
              }
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${passwordStrength.width}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.strengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.text}
                </ThemedText>
              </View>
            )}

            <AuthInput
              label="Confirm Password"
              placeholder="Confirm new password"
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
              onPress={handleResetPassword}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.submitButton}
            >
              Reset Password
            </Button>
          </GlassCard>

          {/* Password Requirements */}
          <GlassCard intensity="light" bordered style={styles.requirementsCard}>
            <View style={styles.requirementHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={themeColors.tint}
              />
              <ThemedText style={styles.requirementTitle}>
                Password Requirements
              </ThemedText>
            </View>
            <View style={styles.requirementsList}>
              <View style={styles.requirement}>
                <Ionicons
                  name={password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={password.length >= 8 ? themeColors.success : themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.requirementText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  At least 8 characters
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/[A-Z]/.test(password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/[A-Z]/.test(password) ? themeColors.success : themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.requirementText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  One uppercase letter
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/[a-z]/.test(password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/[a-z]/.test(password) ? themeColors.success : themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.requirementText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  One lowercase letter
                </ThemedText>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/\d/.test(password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/\d/.test(password) ? themeColors.success : themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.requirementText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  One number
                </ThemedText>
              </View>
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
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  strengthContainer: {
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  requirementsCard: {
    marginBottom: Spacing.xl,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  requirementsList: {
    gap: Spacing.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  requirementText: {
    fontSize: 14,
  },
});
