import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useQuizById } from '@/hooks/use-quizzes';
import { useAuthStore } from '@/store/auth-store';
import { calculateScore } from '@/utils/quiz-utils-convex';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params?.id as string | undefined;
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { addQuizProgress } = useAuthStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<{ score: number; percentage: number } | null>(null);

  const quiz = useQuizById(id);

  if (quiz === undefined) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.errorContainer}>
            <ActivityIndicator size="large" color={themeColors.tint} />
            <ThemedText style={[styles.errorText, { color: themeColors.textSecondary }]}>
              Loading quiz...
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (quiz === null || !quiz) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={themeColors.error} />
            <ThemedText style={styles.errorText}>Quiz not found</ThemedText>
            <Button
              onPress={() => router.back()}
              variant="primary"
              style={styles.errorButton}
            >
              Go Back
            </Button>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={themeColors.error} />
            <ThemedText style={styles.errorText}>This quiz has no questions.</ThemedText>
            <Button
              onPress={() => router.back()}
              variant="primary"
              style={styles.errorButton}
            >
              Go Back
            </Button>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answered = answers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (!answered) {
      Alert.alert('Select an Answer', 'Please select an answer before proceeding.');
      return;
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      // Simulate calculation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = calculateScore(quiz, answers);
      setScore(result);
      setShowResults(true);

      // Save progress
      addQuizProgress({
        quizId: quiz.id,
        score: result.score,
        totalQuestions: quiz.questions.length,
        completedAt: new Date().toISOString(),
        answers: Object.fromEntries(
          Object.entries(answers).map(([key, value]) => [key, String(value)])
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  if (showResults && score) {
    const isPerfect = score.score === quiz.questions.length;
    const passed = score.percentage >= 70;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.resultsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Results Card */}
            <View style={styles.resultsCard}>
              <GlassCard intensity="medium" bordered>
                {/* Celebration or Encouragement */}
                <View style={styles.resultsCelebration}>
                  {isPerfect ? (
                    <>
                      <Ionicons
                        name="star"
                        size={64}
                        color={themeColors.accent}
                      />
                      <ThemedText style={styles.resultsTitle}>
                        Perfect Score! 🎉
                      </ThemedText>
                    </>
                  ) : passed ? (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={64}
                        color={themeColors.success}
                      />
                      <ThemedText style={styles.resultsTitle}>
                        Great Job! ✨
                      </ThemedText>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={64}
                        color={themeColors.warning}
                      />
                      <ThemedText style={styles.resultsTitle}>
                        Good Effort! 💪
                      </ThemedText>
                    </>
                  )}
                </View>

                {/* Score Display */}
                <View style={styles.scoreDisplay}>
                  <View style={styles.scoreCircle}>
                    <ThemedText style={styles.scorePercentage}>
                      {score.percentage}%
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.scoreLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      Score
                    </ThemedText>
                  </View>

                  <View
                    style={[
                      styles.scoreDetails,
                      {
                        backgroundColor: themeColors.surface,
                        borderRadius: BorderRadius.md,
                      },
                    ]}
                  >
                    <View style={styles.scoreDetail}>
                      <ThemedText
                        style={[
                          styles.scoreDetailLabel,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Correct
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.scoreDetailValue,
                          { color: themeColors.success },
                        ]}
                      >
                        {score.score}
                      </ThemedText>
                    </View>
                    <View style={[styles.divider, { backgroundColor: themeColors.textSecondary + '30' }]} />
                    <View style={styles.scoreDetail}>
                      <ThemedText
                        style={[
                          styles.scoreDetailLabel,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Total
                      </ThemedText>
                      <ThemedText style={styles.scoreDetailValue}>
                        {quiz.questions.length}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Status Message */}
                <View style={styles.statusMessage}>
                  <ThemedText
                    style={[
                      styles.statusText,
                      {
                        color: passed ? themeColors.success : themeColors.warning,
                      },
                    ]}
                  >
                    {passed
                      ? 'You passed this quiz! Keep practicing to improve your score.'
                      : 'Try again to get a better score. Review the concepts and take the quiz once more.'}
                  </ThemedText>
                </View>

                {/* Action Buttons */}
                <View style={styles.resultsActions}>
                  <Button
                    onPress={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                      setShowResults(false);
                      setScore(null);
                    }}
                    variant="outline"
                    size="large"
                    style={{ flex: 1 }}
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    onPress={() => router.push('/(tabs)/quizzes')}
                    variant="primary"
                    size="large"
                    style={{ flex: 1, marginLeft: Spacing.md }}
                  >
                    All Quizzes
                  </Button>
                </View>
              </GlassCard>
            </View>

            {/* Review Section */}
            <View style={styles.reviewSection}>
              <ThemedText style={styles.reviewTitle}>Review Answers</ThemedText>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <GlassCard
                    key={question.id}
                    intensity="light"
                    bordered
                    style={styles.reviewCard}
                  >
                    <View
                      style={[
                        styles.reviewHeader,
                        {
                          borderLeftColor: isCorrect
                            ? themeColors.success
                            : themeColors.error,
                        },
                      ]}
                    >
                      <View style={styles.reviewQuestion}>
                        <ThemedText
                          style={[
                            styles.reviewQuestionNumber,
                            { color: themeColors.textSecondary },
                          ]}
                        >
                          Q{index + 1}
                        </ThemedText>
                        <ThemedText style={styles.reviewQuestionText}>
                          {question.question}
                        </ThemedText>
                      </View>
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={isCorrect ? themeColors.success : themeColors.error}
                      />
                    </View>

                    <View style={styles.reviewAnswer}>
                      <ThemedText
                        style={[
                          styles.reviewAnswerLabel,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        Your answer:
                      </ThemedText>
                      <ThemedText style={styles.reviewAnswerText}>
                        {question.options[userAnswer]}
                      </ThemedText>
                    </View>

                    {!isCorrect && (
                      <View style={styles.reviewCorrect}>
                        <ThemedText
                          style={[
                            styles.reviewAnswerLabel,
                            { color: themeColors.success },
                          ]}
                        >
                          Correct answer:
                        </ThemedText>
                        <ThemedText
                          style={[
                            styles.reviewAnswerText,
                            { color: themeColors.success },
                          ]}
                        >
                          {question.options[question.correctAnswer]}
                        </ThemedText>
                      </View>
                    )}

                    <View style={styles.explanation}>
                      <ThemedText
                        style={[
                          styles.explanationLabel,
                          { color: themeColors.tint },
                        ]}
                      >
                        Explanation
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.explanationText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {question.explanation}
                      </ThemedText>
                    </View>
                  </GlassCard>
                );
              })}
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: themeColors.textSecondary + '20' },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Exit Quiz',
                'Are you sure you want to exit? Your progress will not be saved.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Exit',
                    onPress: () => router.back(),
                    style: 'destructive',
                  },
                ]
              );
            }}
          >
            <Ionicons name="chevron-back" size={28} color={themeColors.tint} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <ThemedText style={styles.quizTitle} numberOfLines={1}>
              {quiz.title}
            </ThemedText>
            <ThemedText
              style={[
                styles.questionCounter,
                { color: themeColors.textSecondary },
              ]}
            >
              Q{currentQuestionIndex + 1} of {quiz.questions.length}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Quiz Info',
                `Category: ${quiz.category}\nDifficulty: ${quiz.difficulty}\nEstimated Time: ${quiz.duration} minutes`,
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="information-circle-outline" size={24} color={themeColors.icon} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View
          style={[
            styles.progressBarContainer,
            { backgroundColor: themeColors.textSecondary + '20' },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: themeColors.tint,
              },
            ]}
          />
        </View>

        {/* Question */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <GlassCard intensity="medium" bordered style={styles.questionCard}>
            <ThemedText style={styles.questionText}>
              {currentQuestion.question}
            </ThemedText>
          </GlassCard>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              const isCorrect = index === currentQuestion.correctAnswer;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectAnswer(index)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionButton,
                    {
                      borderColor: isSelected
                        ? themeColors.tint
                        : themeColors.textSecondary + '30',
                      backgroundColor: isSelected
                        ? themeColors.tint + '10'
                        : themeColors.surface,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.optionRadio,
                      {
                        borderColor: isSelected
                          ? themeColors.tint
                          : themeColors.textSecondary + '50',
                        backgroundColor: isSelected
                          ? themeColors.tint
                          : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.optionRadioInner} />
                    )}
                  </View>
                  <ThemedText
                    style={[
                      styles.optionText,
                      isSelected && { fontWeight: '600', color: themeColors.tint },
                    ]}
                  >
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View
          style={[
            styles.footer,
            { borderTopColor: themeColors.textSecondary + '20' },
          ]}
        >
          <Button
            onPress={handlePrevious}
            variant="outline"
            size="large"
            disabled={currentQuestionIndex === 0}
            style={{ flex: 1, opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
          >
            <Ionicons name="chevron-back" size={20} color={themeColors.tint} />
            <ThemedText style={[{ marginLeft: Spacing.sm, color: themeColors.tint }]}>
              Previous
            </ThemedText>
          </Button>

          <Button
            onPress={handleNext}
            variant="primary"
            size="large"
            loading={loading}
            disabled={!answered || loading}
            style={{ flex: 1, marginLeft: Spacing.md }}
          >
            <ThemedText style={[{ color: '#FFFFFF', fontWeight: '600' }]}>
              {currentQuestionIndex === quiz.questions.length - 1
                ? 'Submit'
                : 'Next'}
            </ThemedText>
            <Ionicons
              name={
                currentQuestionIndex === quiz.questions.length - 1
                  ? 'checkmark'
                  : 'chevron-forward'
              }
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: Spacing.sm }}
            />
          </Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  questionCounter: {
    fontSize: 12,
  },
  progressBarContainer: {
    height: 4,
  },
  progressBar: {
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  questionCard: {
    marginBottom: Spacing.xl,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: Spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderRadius: BorderRadius.md,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  // Results styles
  resultsScrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  resultsCard: {
    marginBottom: Spacing.xl,
  },
  resultsCelebration: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginBottom: Spacing.lg,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  scoreDetails: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scoreDetail: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  scoreDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: Spacing.md,
  },
  statusMessage: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  resultsActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  reviewSection: {
    marginBottom: Spacing.xxxl,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  reviewCard: {
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    paddingLeft: Spacing.md,
  },
  reviewQuestion: {
    flex: 1,
  },
  reviewQuestionNumber: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  reviewQuestionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewAnswer: {
    marginBottom: Spacing.md,
  },
  reviewAnswerLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  reviewAnswerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewCorrect: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  explanation: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 19,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: Spacing.lg,
  },
  errorButton: {
    marginTop: Spacing.lg,
    minWidth: 120,
  },
});
