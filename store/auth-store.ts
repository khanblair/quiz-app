import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface QuizProgress {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: Record<string, string>;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  quizProgress: QuizProgress[];
  theme: 'light' | 'dark' | 'auto';

  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  addQuizProgress: (progress: QuizProgress) => void;
  clearQuizProgress: () => void;
  getQuizProgress: (quizId: string) => QuizProgress | undefined;
  loadFromStorage: () => Promise<void>;
  logout: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  quizProgress: [],
  theme: 'auto',

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    get().saveToStorage();
  },

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setTheme: (theme: 'light' | 'dark' | 'auto') => {
    set({ theme });
    get().saveToStorage();
  },

  addQuizProgress: (progress: QuizProgress) => {
    set((state: AuthStore) => ({
      quizProgress: [progress, ...state.quizProgress],
    }));
    get().saveToStorage();
  },

  clearQuizProgress: () => {
    set({ quizProgress: [] });
    get().saveToStorage();
  },

  getQuizProgress: (quizId: string) => {
    const { quizProgress } = get();
    return quizProgress.find((p: QuizProgress) => p.quizId === quizId);
  },

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem('authStore');
      if (stored) {
        const data = JSON.parse(stored);
        set(data);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('authStore');
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        'authStore',
        JSON.stringify({
          user: state.user,
          theme: state.theme,
          quizProgress: state.quizProgress,
        })
      );
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));
