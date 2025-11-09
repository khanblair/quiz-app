import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { QuizProgress, useAuthStore } from '@/store/auth-store';
import { formatDuration, getAllQuizzes, getDifficultyColor } from '@/utils/quiz-utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { user, quizProgress } = useAuthStore();

  const allQuizzes = getAllQuizzes();

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const total = quizProgress.length;
    const avgScore = total > 0
      ? Math.round(quizProgress.reduce((sum: number, q: QuizProgress) => sum + q.score, 0) / total)
      : 0;
    return { total, avgScore };
  }, [quizProgress]);

  // Get recommended quizzes (not completed or completed with low score)
  const recommendedQuizzes = useMemo(() => {
    return allQuizzes
      .filter((quiz) => {
        const progress = quizProgress.find((p: QuizProgress) => p.quizId === quiz.id);
        return !progress || progress.score < quiz.questions.length;
      })
      .slice(0, 2);
  }, [allQuizzes, quizProgress]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <ThemedText style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'Learner'}! 👋
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              Ready to test your knowledge?
            </ThemedText>
          </View>

          {/* Quick Stats */}
          <GlassCard intensity="medium" bordered style={styles.statsCard}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: themeColors.tint + '20' },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={themeColors.tint}
                  />
                </View>
                <ThemedText style={styles.statNumber}>
                  {stats.total}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.statLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  Completed
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: '#10B981' + '20' },
                  ]}
                >
                  <Ionicons
                    name="star"
                    size={24}
                    color="#10B981"
                  />
                </View>
                <ThemedText style={styles.statNumber}>
                  {stats.avgScore}%
                </ThemedText>
                <ThemedText
                  style={[
                    styles.statLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  Avg Score
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconBg,
                    { backgroundColor: themeColors.accent + '20' },
                  ]}
                >
                  <Ionicons
                    name="flame"
                    size={24}
                    color={themeColors.accent}
                  />
                </View>
                <ThemedText style={styles.statNumber}>
                  {allQuizzes.length}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.statLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  Available
                </ThemedText>
              </View>
            </View>
          </GlassCard>

          {/* Recommended Quizzes */}
          {recommendedQuizzes.length > 0 && (
            <View style={styles.recommendedSection}>
              <ThemedText style={styles.sectionTitle}>
                Recommended For You
              </ThemedText>

              {recommendedQuizzes.map((quiz) => (
                <GlassCard
                  key={quiz.id}
                  intensity="light"
                  bordered
                  style={styles.quizCard}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: quiz.id } })}
                    style={styles.quizCardContent}
                  >
                    <View style={styles.quizInfo}>
                      <ThemedText style={styles.quizTitle}>
                        {quiz.title}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.quizMeta,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {quiz.questions.length} questions • {formatDuration(quiz.duration)}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(quiz.difficulty) },
                      ]}
                    >
                      <ThemedText style={styles.difficultyText}>
                        {quiz.difficulty}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                </GlassCard>
              ))}
            </View>
          )}

          {/* Browse All Quizzes */}
          <View style={styles.browseSection}>
            <Button
              onPress={() => router.push('/(tabs)/quizzes')}
              variant="primary"
              size="large"
            >
              <Ionicons name="compass" size={20} color="#FFFFFF" />
              <ThemedText style={[{ marginLeft: Spacing.md, color: '#FFFFFF', fontWeight: '600' }]}>
                Browse All Quizzes
              </ThemedText>
            </Button>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <ThemedText style={styles.sectionTitle}>Why QuizApp?</ThemedText>

            <View style={styles.featureGrid}>
              {[
                {
                  icon: 'school',
                  title: 'Learn',
                  description: 'Expand your knowledge',
                },
                {
                  icon: 'trending-up',
                  title: 'Progress',
                  description: 'Track your improvement',
                },
                {
                  icon: 'beaker',
                  title: 'Master',
                  description: 'Perfect your skills',
                },
              ].map((feature, idx) => (
                <GlassCard
                  key={feature.title}
                  intensity="light"
                  bordered
                  style={styles.featureCard}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={28}
                    color={themeColors.tint}
                    style={styles.featureIcon}
                  />
                  <ThemedText style={styles.featureTitle}>
                    {feature.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.featureDescription,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {feature.description}
                  </ThemedText>
                </GlassCard>
              ))}
            </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  welcomeSection: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
  },
  recommendedSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  quizCard: {
    marginBottom: Spacing.md,
  },
  quizCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  quizMeta: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginLeft: Spacing.md,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  browseSection: {
    marginBottom: Spacing.lg,
  },
  featuresSection: {
    marginBottom: Spacing.xl,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  featureCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});