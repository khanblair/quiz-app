import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDuration, getAllQuizzes, getCategories, getDifficultyColor } from '@/utils/quiz-utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function QuizzesScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const quizzes = getAllQuizzes();
  const categories = getCategories();

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = quiz.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || quiz.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Available Quizzes</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            Choose a quiz to test your knowledge
          </ThemedText>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <GlassCard style={styles.searchCard} intensity="light" bordered>
            <View style={[styles.searchBar, { backgroundColor: themeColors.surfaceHover }]}>
              <Ionicons name="search" size={20} color={themeColors.tint} />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: themeColors.text },
                ]}
                placeholder="Search quizzes..."
                placeholderTextColor={themeColors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={themeColors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>

          {/* Category Filter */}
          <View style={styles.categorySection}>
            <ThemedText style={styles.categoryTitle}>Filter by Category</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor:
                      selectedCategory === null
                        ? themeColors.tint
                        : themeColors.surface,
                    borderColor:
                      selectedCategory === null
                        ? themeColors.tint
                        : themeColors.textSecondary,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.categoryChipText,
                    {
                      color:
                        selectedCategory === null
                          ? themeColors.background
                          : themeColors.text,
                    },
                  ]}
                >
                  All
                </ThemedText>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        selectedCategory === category
                          ? themeColors.tint
                          : themeColors.surface,
                      borderColor:
                        selectedCategory === category
                          ? themeColors.tint
                          : themeColors.textSecondary,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryChipText,
                      {
                        color:
                          selectedCategory === category
                            ? themeColors.background
                            : themeColors.text,
                      },
                    ]}
                  >
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quiz List */}
          <View style={styles.quizList}>
            <ThemedText style={styles.resultCount}>
              {filteredQuizzes.length} Quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
            </ThemedText>

            {filteredQuizzes.map((quiz) => (
              <GlassCard
                key={quiz.id}
                style={styles.quizCard}
                intensity="medium"
                bordered
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: quiz.id } })}
                >
                  {/* Quiz Header */}
                  <View style={styles.quizHeader}>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.quizTitle}>{quiz.title}</ThemedText>
                      <ThemedText
                        style={[
                          styles.quizDescription,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {quiz.description}
                      </ThemedText>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={themeColors.tint}
                    />
                  </View>

                  {/* Quiz Meta */}
                  <View style={styles.quizMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="layers" size={16} color={themeColors.icon} />
                      <ThemedText style={[styles.metaText, { color: themeColors.textSecondary }]}>
                        {quiz.questions.length} Q's
                      </ThemedText>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={16} color={themeColors.icon} />
                      <ThemedText style={[styles.metaText, { color: themeColors.textSecondary }]}>
                        {formatDuration(quiz.duration)}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: getDifficultyColor(quiz.difficulty),
                        },
                      ]}
                    >
                      <ThemedText style={styles.difficultyText}>
                        {quiz.difficulty}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            ))}

            {filteredQuizzes.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search"
                  size={48}
                  color={themeColors.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.emptyStateText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  No quizzes found
                </ThemedText>
              </View>
            )}
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  searchCard: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: Spacing.md,
    fontSize: 16,
  },
  categorySection: {
    marginBottom: Spacing.md,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  categoryScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    marginRight: Spacing.md,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quizList: {
    marginBottom: Spacing.xl,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
  quizCard: {
    marginBottom: Spacing.md,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  quizDescription: {
    fontSize: 13,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: Spacing.md,
  },
});
