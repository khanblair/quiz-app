import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const isTokenSynced = useRef<boolean>(false);
  
  const updatePushToken = useMutation(api.users.updatePushToken);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Configure how notifications are handled when app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Register for push notifications and get token
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          // Store token in Convex only if authenticated
          if (isSignedIn && isLoaded) {
            updatePushToken({ pushToken: token.data })
              .catch((error) => {
                console.error('Failed to update push token in Convex:', error);
              });
          } else {
            console.warn('User not authenticated yet, deferring push token update');
          }
        }
      })
      .catch((error: any) => {
        console.error('Error registering for push notifications:', error);
      });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);
      setNotification(notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User interacted with notification:', response);
      const data = response.notification.request.content.data;
      
      // Handle navigation or actions based on notification data
      if (data?.screen) {
        // Navigate to specific screen - you can implement this
        console.log('Navigate to:', data.screen);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [updatePushToken, isSignedIn, isLoaded]);

  // When user authenticates, update the push token if it was deferred
  useEffect(() => {
    if (isSignedIn && isLoaded && expoPushToken && !isTokenSynced.current) {
      updatePushToken({ pushToken: expoPushToken.data })
        .then(() => {
          console.log('Push token successfully synced to Convex after authentication');
          isTokenSynced.current = true;
        })
        .catch((error) => {
          console.error('Failed to sync push token after authentication:', error);
        });
    }
  }, [isSignedIn, isLoaded, expoPushToken, updatePushToken]);

  return {
    expoPushToken,
    notification,
  };
};

async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
  let token: Notifications.ExpoPushToken | undefined;

  // Check if running on a physical device
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices, not simulators/emulators');
    return undefined;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If permission denied, return
  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return undefined;
  }

  // Get the Expo push token
  try {
    const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || '7a6ae96e-bddc-4b9e-ad34-ccc3363452ec';
    token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log('Expo Push Token:', token.data);
  } catch (error) {
    console.error('Error getting Expo push token:', error);
  }

  // Android-specific channel configuration
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A8917',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
      showBadge: true,
    });

    // Create additional channels for different notification types
    await Notifications.setNotificationChannelAsync('quiz', {
      name: 'Quiz Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A8917',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('achievement', {
      name: 'Achievement Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500],
      lightColor: '#FFD700',
      sound: 'default',
    });
  }

  return token;
}
