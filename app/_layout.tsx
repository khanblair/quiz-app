import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

// Cache for Clerk tokens using SecureStore
const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, token: string) => SecureStore.setItemAsync(key, token),
};

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppStack() {
  const appTheme = useAppTheme();
  const { isLoading, isAuthenticated, loadFromStorage } = useAuthStore();
  const [authReady, setAuthReady] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    loadFromStorage().then(() => {
      setAuthReady(true);
    });
  }, []);

  if (!authReady) {
    return (
      <ThemeProvider value={appTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={appTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isSignedIn || isAuthenticated ? (
          <>
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                title: 'QuizApp'
              }} 
            />
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: 'modal', 
                title: 'Modal',
                headerShown: true
              }} 
            />
            <Stack.Screen 
              name="privacy-policy" 
              options={{ 
                title: 'Privacy Policy',
                headerShown: true,
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="terms" 
              options={{ 
                title: 'Terms & Conditions',
                headerShown: true,
                presentation: 'modal'
              }} 
            />
          </>
        ) : (
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false,
              title: 'Authentication'
            }} 
          />
        )}
        <Stack.Screen 
          name="splash" 
          options={{ 
            headerShown: false,
            title: 'QuizApp'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ConvexProvider client={convex}>
        <AppStack />
      </ConvexProvider>
    </ClerkProvider>
  );
}
