import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const theme = useAppTheme();
  const themeColors = Colors[theme];

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us when you create an account, take quizzes, or communicate with us. This may include:

• Account information (name, email address)
• Quiz responses and performance data
• Device information and usage statistics
• Authentication credentials (securely managed by Clerk)

All data is collected to provide and improve our services.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Track your quiz progress and performance
• Send you updates and educational content
• Respond to your comments and questions
• Protect against fraudulent or illegal activity
• Comply with legal obligations

We never sell your personal information to third parties.`,
    },
    {
      title: '3. Data Storage and Security',
      content: `Your data is stored securely using industry-standard encryption:

• Passwords are hashed and never stored in plain text
• Authentication is managed by Clerk with enterprise-grade security
• Quiz data is stored locally on your device and synced securely
• We use HTTPS for all data transmission
• Regular security audits and updates

We take reasonable measures to protect your information from unauthorized access, disclosure, or destruction.`,
    },
    {
      title: '4. Third-Party Services',
      content: `We use the following third-party services:

• Clerk - Authentication and user management
• Expo - Mobile application framework
• AsyncStorage - Local data persistence

These services have their own privacy policies. We recommend reviewing them to understand how they handle your data.`,
    },
    {
      title: '5. Your Rights and Choices',
      content: `You have the right to:

• Access your personal information
• Correct inaccurate data
• Delete your account and associated data
• Export your quiz history
• Opt out of promotional communications
• Object to certain data processing activities

To exercise these rights, please contact us at privacy@quizapp.com.`,
    },
    {
      title: '6. Data Retention',
      content: `We retain your information for as long as your account is active or as needed to provide services. When you delete your account:

• Personal information is removed within 30 days
• Quiz progress data is permanently deleted
• Aggregated, anonymized data may be retained for analytics

You can clear your quiz progress at any time from the Settings page.`,
    },
    {
      title: '7. Children\'s Privacy',
      content: `QuizApp is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.`,
    },
    {
      title: '8. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.`,
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by:

• Posting the new policy on this page
• Updating the "Last Updated" date
• Sending you an email notification (for material changes)

Continued use of QuizApp after changes indicates acceptance of the updated policy.`,
    },
    {
      title: '10. Contact Us',
      content: `If you have questions or concerns about this privacy policy, please contact us:

Email: privacy@quizapp.com
Website: https://quizapp.com/privacy
Address: QuizApp Team, Privacy Department

We aim to respond to all inquiries within 48 hours.`,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
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
                { backgroundColor: themeColors.tint + '20' },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={32}
                color={themeColors.tint}
              />
            </View>
            <ThemedText style={styles.title}>Privacy Policy</ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              Last Updated: November 8, 2025
            </ThemedText>
            <ThemedText
              style={[
                styles.description,
                { color: themeColors.textSecondary },
              ]}
            >
              At QuizApp, we take your privacy seriously. This policy explains
              how we collect, use, and protect your personal information.
            </ThemedText>
          </View>

          {/* Content Sections */}
          {sections.map((section, index) => (
            <GlassCard
              key={index}
              intensity="light"
              bordered
              style={styles.sectionCard}
            >
              <ThemedText style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <ThemedText
                style={[
                  styles.sectionContent,
                  { color: themeColors.textSecondary },
                ]}
              >
                {section.content}
              </ThemedText>
            </GlassCard>
          ))}

          {/* Footer */}
          <GlassCard intensity="medium" bordered style={styles.footerCard}>
            <View style={styles.footerIcon}>
              <Ionicons name="lock-closed" size={24} color={themeColors.tint} />
            </View>
            <ThemedText
              style={[styles.footerText, { color: themeColors.textSecondary }]}
            >
              Your privacy and data security are our top priorities. We are
              committed to protecting your information and being transparent
              about our practices.
            </ThemedText>
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
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  sectionCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
  },
  footerCard: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerIcon: {
    marginBottom: Spacing.md,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
