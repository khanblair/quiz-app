import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthInput } from '@/components/ui/auth-input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';
import { useAuth, useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
    Alert,
    Dimensions,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { setUser } = useAuthStore();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn: clerkSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const upsertUser = useMutation(api.users.upsertUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!isLoaded) return;
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        
        // Sync user to Convex
        try {
          await upsertUser({
            clerkId: result.createdUserId!,
            email: email,
            name: result.userData?.firstName || email.split('@')[0],
            imageUrl: result.userData?.imageUrl,
          });
        } catch (convexError) {
          console.warn('Failed to sync user to Convex:', convexError);
        }
        
        router.replace('/(tabs)');
      } else {
        setErrors({ email: 'Additional verification required. Please check your email.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = (error?.errors && error.errors[0]?.longMessage) || error?.message || 'Login failed. Please try again.';
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // If Clerk already reports the user as signed in, redirect to dashboard
      if (clerkSignedIn) {
        router.replace('/(tabs)');
        return;
      }
      // Ensure Clerk SDK is loaded before starting OAuth
      if (!clerkLoaded) {
        // Small wait or inform user
        Alert.alert('Please wait', 'Authentication is still initializing. Try again in a moment.');
        return;
      }
      const { createdSessionId, setActive: setActiveOAuth, signIn: si, signUp: su } = await startOAuthFlow();
      if (createdSessionId) {
        await setActiveOAuth?.({ session: createdSessionId });
        
        // Sync user to Convex (will be handled automatically by ConvexProviderWithClerk)
        // But we can trigger it explicitly to ensure it happens
        try {
          const userData = si?.userData || su?.userData;
          if (userData) {
            await upsertUser({
              clerkId: userData.id,
              email: userData.emailAddresses?.[0]?.emailAddress || '',
              name: userData.firstName || userData.username || 'User',
              imageUrl: userData.imageUrl,
            });
          }
        } catch (convexError) {
          console.warn('Failed to sync user to Convex:', convexError);
        }
        
        router.replace('/(tabs)');
        return;
      }
      // If no session, there may be next steps (e.g., account linking)
      if (si || su) {
        // For simplicity, navigate to tabs and let Clerk handle linking in hosted UI
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      const msg = error?.message || String(error);
      // Handle Clerk "already signed in" specific error gracefully
      if (msg.toLowerCase().includes("already signed in")) {
        router.replace('/(tabs)');
        return;
      }
      Alert.alert('Google Sign-In failed', 'Please try again.');
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
            <ThemedText style={styles.welcomeTitle}>Welcome Back</ThemedText>
            <ThemedText
              style={[
                styles.welcomeSubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              Sign in to your account
            </ThemedText>
          </View>

          {/* Form Card */}
          <GlassCard style={styles.formCard} intensity="medium" bordered>
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
              placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/forgot-password' as any)}
            >
              <ThemedText
                style={[
                  styles.forgotPasswordText,
                  { color: themeColors.tint },
                ]}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.loginButton}
            >
              Sign In
            </Button>
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
              Or continue with
            </ThemedText>
            <View
              style={[
                styles.divider,
                { backgroundColor: themeColors.textSecondary },
              ]}
            />
          </View>

          {/* Social Login */}
          <Button
            onPress={handleGoogleLogin}
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

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <ThemedText style={{ color: themeColors.textSecondary }}>
              Don't have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <ThemedText
                style={[
                  styles.signUpLink,
                  { color: themeColors.tint, fontWeight: '600' },
                ]}
              >
                Sign Up
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
    marginBottom: Spacing.xxxl,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpLink: {
    marginLeft: Spacing.sm,
  },
});
