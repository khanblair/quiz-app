import { useAuthStore } from '@/store/auth-store';
import { useColorScheme } from 'react-native';

export function useAppTheme(): 'light' | 'dark' {
  const deviceColorScheme = useColorScheme();
  const { theme } = useAuthStore();

  if (theme === 'auto') {
    return (deviceColorScheme as 'light' | 'dark') || 'light';
  }
  return theme;
}
