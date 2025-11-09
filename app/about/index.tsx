import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const theme = useAppTheme();
  const themeColors = Colors[theme];

  const features = [
    {
      icon: 'school-outline',
      title: 'Learn & Grow',
      description: 'Access a wide variety of quizzes across multiple categories to expand your knowledge.',
    },
    {
      icon: 'trophy-outline',
      title: 'Track Progress',
      description: 'Monitor your quiz performance with detailed statistics and achievement tracking.',
    },
    {
      icon: 'flash-outline',
      title: 'Instant Feedback',
      description: 'Get immediate explanations for each answer to enhance your learning experience.',
    },
    {
      icon: 'moon-outline',
      title: 'Dark Mode',
      description: 'Comfortable viewing experience with automatic dark mode support.',
    },
  ];

  const teamInfo = {
    version: '1.0.0',
    buildNumber: '2025.11.08',
    developer: 'QuizApp Team',
    year: new Date().getFullYear(),
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@quizapp.com?subject=QuizApp Support');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://quizapp.com');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: themeColors.tint },
              ]}
            >
              <ThemedText
                style={[styles.logoText, { color: themeColors.background }]}
              >
                QA
              </ThemedText>
            </View>
            <ThemedText style={styles.appName}>QuizApp</ThemedText>
            <ThemedText
              style={[styles.tagline, { color: themeColors.textSecondary }]}
            >
              Master Your Knowledge, One Quiz at a Time
            </ThemedText>
            <ThemedText
              style={[styles.version, { color: themeColors.textSecondary }]}
            >
              Version {teamInfo.version} (Build {teamInfo.buildNumber})
            </ThemedText>
          </View>

          {/* Mission Statement */}
          <GlassCard intensity="medium" bordered style={styles.missionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="bulb-outline"
                size={24}
                color={themeColors.tint}
              />
              <ThemedText style={styles.sectionTitle}>Our Mission</ThemedText>
            </View>
            <ThemedText
              style={[
                styles.missionText,
                { color: themeColors.textSecondary },
              ]}
            >
              QuizApp is designed to make learning engaging and accessible for
              everyone. We believe that knowledge should be fun to acquire and
              easy to track. Our platform provides a modern, intuitive interface
              for testing and improving your knowledge across various subjects.
            </ThemedText>
          </GlassCard>

          {/* Features */}
          <View style={styles.featuresSection}>
            <ThemedText style={styles.featuresTitle}>Key Features</ThemedText>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <GlassCard
                  key={index}
                  intensity="light"
                  bordered
                  style={styles.featureCard}
                >
                  <View
                    style={[
                      styles.featureIconContainer,
                      { backgroundColor: themeColors.tint + '20' },
                    ]}
                  >
                    <Ionicons
                      name={feature.icon as any}
                      size={28}
                      color={themeColors.tint}
                    />
                  </View>
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

          {/* Team & Credits */}
          <GlassCard intensity="light" bordered style={styles.teamCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="people-outline"
                size={24}
                color={themeColors.tint}
              />
              <ThemedText style={styles.sectionTitle}>
                Development Team
              </ThemedText>
            </View>
            <ThemedText
              style={[styles.teamText, { color: themeColors.textSecondary }]}
            >
              Built with ❤️ by the {teamInfo.developer}
            </ThemedText>
            <ThemedText
              style={[styles.teamText, { color: themeColors.textSecondary }]}
            >
              Powered by React Native & Expo
            </ThemedText>
            <ThemedText
              style={[styles.teamText, { color: themeColors.textSecondary }]}
            >
              © {teamInfo.year} QuizApp. All rights reserved.
            </ThemedText>
          </GlassCard>

          {/* Contact Section */}
          <GlassCard intensity="medium" bordered style={styles.contactCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="mail-outline"
                size={24}
                color={themeColors.tint}
              />
              <ThemedText style={styles.sectionTitle}>Get in Touch</ThemedText>
            </View>
            <View style={styles.contactButtons}>
              <View
                style={[
                  styles.contactButton,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.tint,
                  },
                ]}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={themeColors.tint}
                  style={styles.contactIcon}
                />
                <ThemedText
                  style={[styles.contactText, { color: themeColors.tint }]}
                  onPress={handleContactSupport}
                >
                  Contact Support
                </ThemedText>
              </View>
              <View
                style={[
                  styles.contactButton,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.tint,
                  },
                ]}
              >
                <Ionicons
                  name="globe"
                  size={20}
                  color={themeColors.tint}
                  style={styles.contactIcon}
                />
                <ThemedText
                  style={[styles.contactText, { color: themeColors.tint }]}
                  onPress={handleVisitWebsite}
                >
                  Visit Website
                </ThemedText>
              </View>
            </View>
          </GlassCard>

          {/* Technology Stack */}
          <GlassCard intensity="light" bordered style={styles.techCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="code-slash-outline"
                size={24}
                color={themeColors.tint}
              />
              <ThemedText style={styles.sectionTitle}>
                Technology Stack
              </ThemedText>
            </View>
            <View style={styles.techList}>
              {[
                'React Native',
                'Expo SDK',
                'TypeScript',
                'Clerk Authentication',
                'Zustand State Management',
                'Expo Router',
              ].map((tech, index) => (
                <View key={index} style={styles.techItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={themeColors.success}
                  />
                  <ThemedText
                    style={[
                      styles.techText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {tech}
                  </ThemedText>
                </View>
              ))}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  version: {
    fontSize: 13,
    fontWeight: '500',
  },
  missionCard: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: Spacing.md,
  },
  missionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: Spacing.xl,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  featuresGrid: {
    gap: Spacing.md,
  },
  featureCard: {
    padding: Spacing.lg,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  teamCard: {
    marginBottom: Spacing.xl,
  },
  teamText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  contactCard: {
    marginBottom: Spacing.xl,
  },
  contactButtons: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  contactIcon: {
    marginRight: Spacing.md,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
  },
  techCard: {
    marginBottom: Spacing.xl,
  },
  techList: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  techText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
