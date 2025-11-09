import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  const theme = useAppTheme();
  const themeColors = Colors[theme];

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using QuizApp, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our application.

These terms apply to all users, including visitors, registered users, and contributors.`,
    },
    {
      title: '2. User Accounts',
      content: `To access certain features, you must create an account:

• You must provide accurate and complete information
• You are responsible for maintaining account security
• You must be at least 13 years old to create an account
• One person may not maintain multiple accounts
• You must notify us of any unauthorized access

We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
      title: '3. Acceptable Use',
      content: `You agree to use QuizApp only for lawful purposes. You must not:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit harmful or malicious code
• Attempt to gain unauthorized access to our systems
• Harass, abuse, or harm other users
• Use automated systems to access the service
• Impersonate others or misrepresent your affiliation

Violation of these terms may result in account termination.`,
    },
    {
      title: '4. Intellectual Property',
      content: `QuizApp and its content are protected by copyright and other intellectual property laws:

• All quiz content, text, graphics, and software are owned by QuizApp
• You may not copy, modify, or distribute our content without permission
• User-generated content remains your property but grants us a license to use it
• Trademarks and logos are property of their respective owners

We respect intellectual property rights and expect users to do the same.`,
    },
    {
      title: '5. Quiz Content and Accuracy',
      content: `While we strive for accuracy, QuizApp makes no warranties regarding:

• Accuracy or completeness of quiz content
• Suitability for educational or professional purposes
• Availability or uninterrupted access to services
• Error-free operation of the application

Quiz content is for educational and entertainment purposes only. Always verify critical information from authoritative sources.`,
    },
    {
      title: '6. User-Generated Content',
      content: `If you contribute content to QuizApp:

• You grant us a worldwide, non-exclusive license to use your content
• You represent that you have the right to share the content
• You agree that your content does not violate any laws or rights
• We may remove content that violates these terms
• You retain ownership of your original content

We are not responsible for user-generated content and do not endorse it.`,
    },
    {
      title: '7. Privacy and Data Protection',
      content: `Your privacy is important to us:

• Our Privacy Policy explains how we collect and use data
• We use industry-standard security measures
• You control your personal information
• We comply with applicable data protection laws

Please review our Privacy Policy for detailed information.`,
    },
    {
      title: '8. Payment and Subscriptions',
      content: `Currently, QuizApp is free to use. If we introduce paid features in the future:

• Pricing will be clearly displayed
• Payments are processed securely by third-party providers
• Subscriptions may be canceled according to our refund policy
• Prices are subject to change with notice

We will update these terms before introducing any paid features.`,
    },
    {
      title: '9. Disclaimers and Limitations',
      content: `QuizApp is provided "as is" without warranties of any kind:

• We disclaim all warranties, express or implied
• We are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount you paid us (if any)
• Some jurisdictions may not allow these limitations

This does not affect your statutory rights as a consumer.`,
    },
    {
      title: '10. Modifications to Service',
      content: `We reserve the right to:

• Modify or discontinue features at any time
• Update these terms with notice to users
• Change pricing for future paid features
• Suspend service for maintenance or updates

We will make reasonable efforts to notify users of material changes.`,
    },
    {
      title: '11. Termination',
      content: `We may terminate or suspend your account:

• Immediately for violations of these terms
• For prolonged inactivity
• For legal or regulatory reasons
• At our discretion with notice

Upon termination, your right to use QuizApp ceases immediately. You may delete your account at any time from the Settings page.`,
    },
    {
      title: '12. Governing Law',
      content: `These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through:

• Good faith negotiation
• Binding arbitration (where permitted)
• Courts of competent jurisdiction

You agree to the exclusive jurisdiction of these courts.`,
    },
    {
      title: '13. Contact Information',
      content: `For questions about these Terms and Conditions:

Email: legal@quizapp.com
Website: https://quizapp.com/terms
Address: QuizApp Team, Legal Department

We aim to respond to all inquiries within 5 business days.`,
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
                name="document-text"
                size={32}
                color={themeColors.tint}
              />
            </View>
            <ThemedText style={styles.title}>Terms & Conditions</ThemedText>
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
              Please read these terms carefully before using QuizApp. By using
              our service, you agree to comply with and be bound by these terms.
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
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={themeColors.success}
              />
            </View>
            <ThemedText
              style={[styles.footerText, { color: themeColors.textSecondary }]}
            >
              Thank you for taking the time to read our Terms and Conditions. By
              using QuizApp, you help us build a better learning experience for
              everyone.
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
