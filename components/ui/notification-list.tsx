import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';


interface NotificationItemProps {
  _id: any;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: number;
  onPress: () => void;
  onDelete: () => void;
}

function NotificationItem({
  title,
  message,
  type,
  read,
  createdAt,
  onPress,
  onDelete,
}: NotificationItemProps) {
  const theme = useAppTheme();
  const themeColors = Colors[theme];

  const getIcon = () => {
    switch (type) {
      case 'quiz':
        return 'document-text-outline';
      case 'achievement':
        return 'trophy-outline';
      case 'system':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.notificationItem,
        !read && { backgroundColor: themeColors.tint + '10' },
      ]}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: themeColors.tint + '20' },
          ]}
        >
          <Ionicons name={getIcon() as any} size={20} color={themeColors.tint} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText
            style={[styles.message, { color: themeColors.textSecondary }]}
            numberOfLines={2}
          >
            {message}
          </ThemedText>
          <ThemedText
            style={[styles.time, { color: themeColors.textSecondary }]}
          >
            {formatTime(createdAt)}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
      {!read && (
        <View
          style={[styles.unreadIndicator, { backgroundColor: themeColors.tint }]}
        />
      )}
    </TouchableOpacity>
  );
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function NotificationList() {
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  
  const notifications = useQuery(api.mobile.notifications.getUserNotifications);
  const markAsRead = useMutation(api.mobile.notifications.markAsRead);
  const deleteNotification = useMutation(api.mobile.notifications.deleteNotification);
  const markAllAsRead = useMutation(api.mobile.notifications.markAllAsRead);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Refetch happens automatically with Convex
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleNotificationPress = async (notification: any) => {
    if (!notification.read) {
      try {
        await markAsRead({ _id: notification._id });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const handleDelete = async (notificationId: any) => {
    try {
      await deleteNotification({ _id: notificationId });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!notifications) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loading}>Loading notifications...</ThemedText>
      </ThemedView>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ThemedView style={styles.container}>
      {notifications.length > 0 && unreadCount > 0 && (
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </ThemedText>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <ThemedText style={[styles.markAllButton, { color: themeColors.tint }]}>
              Mark all as read
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            {...item}
            onPress={() => handleNotificationPress(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        ListEmptyComponent={
          <GlassCard intensity="light" bordered style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={themeColors.textSecondary}
            />
            <ThemedText
              style={[styles.emptyText, { color: themeColors.textSecondary }]}
            >
              No notifications yet
            </ThemedText>
          </GlassCard>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.tint}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  markAllButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    position: 'relative',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  time: {
    fontSize: 11,
  },
  deleteButton: {
    marginLeft: Spacing.sm,
  },
  unreadIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    marginTop: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
});
