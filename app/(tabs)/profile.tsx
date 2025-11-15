import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { useAppTheme } from '@/hooks/use-app-theme';
import { QuizProgress, useAuthStore } from '@/store/auth-store';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { user: legacyUser, logout, quizProgress } = useAuthStore();
  const { user: clerkUser } = useUser();
  const { signOut } = useAuth();
  const deleteAccount = useMutation(api.users.deleteUserAccount);
  const [signingOut, setSigningOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        onPress: async () => {
          setSigningOut(true);
          try {
            // Attempt Clerk sign out first
            await signOut();
          } catch (e) {
            console.warn('Clerk signOut failed, falling back to local logout', e);
          }

          try {
            // Always clear local auth state
            await logout();
          } catch (err) {
            console.error('Local logout failed', err);
          }

          setSigningOut(false);
          // Ensure we land on auth flow
          router.replace('/(auth)/login');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including quiz progress and notifications.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setDeletingAccount(true);
            try {
              // Delete from Convex first
              await deleteAccount();
              
              // Delete from Clerk
              try {
                await clerkUser?.delete();
              } catch (clerkError) {
                console.warn('Clerk account deletion failed:', clerkError);
              }

              // Clear local storage
              await logout();

              Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/(auth)/login'),
                  },
                ]
              );
            } catch (error: any) {
              console.error('Account deletion error:', error);
              Alert.alert(
                'Deletion Failed',
                error?.message || 'Failed to delete account. Please try again.'
              );
            } finally {
              setDeletingAccount(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Calculate statistics
  const totalQuizzesTaken = quizProgress.length;
  const averageScore = totalQuizzesTaken > 0
    ? Math.round(
        quizProgress.reduce((sum: number, q: QuizProgress) => sum + q.score, 0) / totalQuizzesTaken
      )
    : 0;
  const perfectScores = quizProgress.filter((q: QuizProgress) => q.score === q.totalQuestions).length;

  const stats = [
    {
      label: 'Quizzes Taken',
      value: totalQuizzesTaken.toString(),
      icon: 'list-outline',
    },
    {
      label: 'Avg Score',
      value: `${averageScore}%`,
      icon: 'stats-chart-outline',
    },
    {
      label: 'Perfect Scores',
      value: perfectScores.toString(),
      icon: 'star-outline',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <GlassCard
            intensity="medium"
            bordered
            style={styles.profileCard}
          >
            <View style={styles.profileContent}>
              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: themeColors.tint },
                ]}
              >
                <ThemedText style={styles.avatarText}>
                  {(clerkUser?.firstName || legacyUser?.name || 'U').charAt(0).toUpperCase()}
                </ThemedText>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>
                  {clerkUser?.fullName || legacyUser?.name || 'Learner'}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.userEmail,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {clerkUser?.primaryEmailAddress?.emailAddress || legacyUser?.email}
                </ThemedText>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity
                style={[
                  styles.editButton,
                  { backgroundColor: themeColors.tint + '20' },
                ]}
              >
                <Ionicons name="pencil" size={18} color={themeColors.tint} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Statistics */}
          <View style={styles.statsSection}>
            <ThemedText style={styles.statsTitle}>Your Statistics</ThemedText>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <GlassCard
                  key={stat.label}
                  intensity="light"
                  bordered
                  style={[
                    styles.statCard,
                    { marginRight: index % 2 === 0 ? Spacing.md : 0 },
                  ]}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={28}
                    color={themeColors.tint}
                    style={styles.statIcon}
                  />
                  <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                  <ThemedText
                    style={[
                      styles.statLabel,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {stat.label}
                  </ThemedText>
                </GlassCard>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <ThemedText style={styles.activityTitle}>Recent Activity</ThemedText>
            {quizProgress.length > 0 ? (
              <GlassCard intensity="light" bordered>
                {quizProgress.slice(0, 5).map((quiz: QuizProgress, index: number) => (
                  <View key={quiz.quizId}>
                    <View style={styles.activityItem}>
                      <View style={styles.activityLeft}>
                        <View
                          style={[
                            styles.activityDot,
                            {
                              backgroundColor: themeColors.success,
                            },
                          ]}
                        />
                        <View>
                          <ThemedText style={styles.activityQuizName}>
                            Quiz #{quiz.quizId}
                          </ThemedText>
                          <ThemedText
                            style={[
                              styles.activityDate,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {new Date(quiz.completedAt).toLocaleDateString()}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText
                        style={[
                          styles.activityScore,
                          {
                            color:
                              quiz.score === quiz.totalQuestions
                                ? themeColors.success
                                : themeColors.tint,
                          },
                        ]}
                      >
                        {quiz.score}/{quiz.totalQuestions}
                      </ThemedText>
                    </View>
                    {index < Math.min(4, quizProgress.length - 1) && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: themeColors.textSecondary + '20' },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </GlassCard>
            ) : (
              <GlassCard intensity="light" bordered style={styles.emptyActivity}>
                <Ionicons
                  name="document-outline"
                  size={32}
                  color={themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.emptyActivityText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  No quizzes taken yet
                </ThemedText>
              </GlassCard>
            )}
          </View>

          {/* Logout Button */}
          <Button
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
            disabled={signingOut || deletingAccount}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={Colors[theme].error}
            />
            <ThemedText
              style={[
                {
                  marginLeft: Spacing.md,
                  color: Colors[theme].error,
                  fontWeight: '600',
                },
              ]}
            >
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </ThemedText>
          </Button>

          {/* Delete Account Button */}
          <Button
            onPress={handleDeleteAccount}
            variant="outline"
            size="large"
            style={[styles.deleteButton, { borderColor: Colors[theme].error }]}
            disabled={signingOut || deletingAccount}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={Colors[theme].error}
            />
            <ThemedText
              style={[
                {
                  marginLeft: Spacing.md,
                  color: Colors[theme].error,
                  fontWeight: '600',
                },
              ]}
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </ThemedText>
          </Button>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    marginBottom: Spacing.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  statIcon: {
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: Spacing.lg,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  activityQuizName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDate: {
    fontSize: 12,
  },
  activityScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyActivityText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  logoutButton: {
    marginTop: Spacing.lg,
    borderColor: Colors.light.error,
  },
  deleteButton: {
    marginTop: Spacing.md,
  },
});
