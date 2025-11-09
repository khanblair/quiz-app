import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/ui/glass-card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themeColors = Colors[theme];
  const { theme: currentTheme, setTheme, clearQuizProgress } = useAuthStore();

  const isDarkMode = currentTheme === 'dark' || (currentTheme === 'auto' && theme === 'dark');

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleAbout = () => {
    router.push('/about' as any);
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy' as any);
  };

  const handleTerms = () => {
    router.push('/terms' as any);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all quiz progress and settings?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            clearQuizProgress();
            Alert.alert('Success', 'All quiz progress has been cleared.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Display',
      settings: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'toggle' as const,
          value: isDarkMode,
          onChange: handleThemeChange,
        },
      ],
    },
    {
      title: 'About',
      settings: [
        {
          icon: 'information-circle',
          label: 'About QuizApp',
          type: 'button' as const,
          onPress: handleAbout,
        },
        {
          icon: 'document-text',
          label: 'Privacy Policy',
          type: 'button' as const,
          onPress: handlePrivacyPolicy,
        },
        {
          icon: 'shield-checkmark',
          label: 'Terms & Conditions',
          type: 'button' as const,
          onPress: handleTerms,
        },
      ],
    },
    {
      title: 'Data',
      settings: [
        {
          icon: 'trash',
          label: 'Clear Quiz Progress',
          type: 'button' as const,
          destructive: true,
          onPress: handleClearData,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {settingsSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  { color: themeColors.tint },
                ]}
              >
                {section.title}
              </ThemedText>

              <GlassCard intensity="light" bordered style={styles.sectionCard}>
                {section.settings.map((setting, index) => (
                  <View key={setting.label}>
                    <TouchableOpacity
                      style={styles.settingItem}
                      onPress={
                        setting.type === 'button'
                          ? setting.onPress
                          : undefined
                      }
                      disabled={setting.type === 'toggle'}
                    >
                      <View style={styles.settingLeft}>
                        <Ionicons
                          name={setting.icon as any}
                          size={24}
                          color={
                            'destructive' in setting && (setting as any).destructive
                              ? Colors[theme].error
                              : themeColors.tint
                          }
                          style={styles.settingIcon}
                        />
                        <ThemedText
                          style={[
                            styles.settingLabel,
                            'destructive' in setting && (setting as any).destructive && { color: Colors[theme].error },
                          ]}
                        >
                          {setting.label}
                        </ThemedText>
                      </View>

                      {setting.type === 'toggle' && (
                        <Switch
                          value={setting.value}
                          onValueChange={setting.onChange}
                          trackColor={{
                            false: themeColors.textSecondary,
                            true: themeColors.tint,
                          }}
                          thumbColor={themeColors.background}
                        />
                      )}

                      {setting.type === 'button' && (
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={themeColors.textSecondary}
                        />
                      )}
                    </TouchableOpacity>

                    {index < section.settings.length - 1 && (
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: themeColors.textSecondary + '30' },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </GlassCard>
            </View>
          ))}
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
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
});
