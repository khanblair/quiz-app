# QuizApp - Modern Quiz Application

A beautiful, feature-rich quiz application built with React Native, Expo, and TypeScript. Test your knowledge across multiple categories with an intuitive and professional interface.

## 🌟 Features

### Authentication
- **Login/Signup Screens** - Beautiful glassmorphic authentication interface with email and password validation
- **Google Authentication** - One-click sign-in with Google (mock integration included)
- **Local Storage** - Persistent user sessions and quiz progress using AsyncStorage

### User Interface
- **Glassmorphism Design** - Modern transparent cards with blur effects for a premium look
- **Responsive Layout** - Optimized for all device sizes (mobile, tablet, web)
- **Dark/Light Theme** - Full theme support with smooth transitions
- **Professional Components** - Reusable UI components: GlassCard, Button, AuthInput

### Quiz Management
- **4 Tab Navigation**
  - **Home** - Dashboard with statistics, recommended quizzes, and quick access
  - **Quizzes** - Browse all quizzes with search and category filtering
  - **Settings** - Theme toggle, app info, and data management
  - **Profile** - User stats, activity history, and account management

### Quiz Features
- **Interactive Questions** - Multiple-choice questions with smooth navigation
- **Progress Tracking** - Visual progress bar and question counter
- **Answer Review** - Detailed results with explanations for each question
- **Performance Analytics** - Score breakdown, statistics, and personal records
- **Quiz Categories** - Organized by Frontend, Backend, Security, Mobile, etc.

### Data Management
- **Local JSON Storage** - Quiz questions stored in `assets/data/quizzes.json`
- **Progress Persistence** - User quiz attempts saved locally
- **State Management** - Zustand store for efficient state management

## 📁 Project Structure

```
quiz-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx          # Login screen
│   │   ├── signup.tsx         # Sign up screen
│   │   └── _layout.tsx        # Auth navigation
│   ├── (tabs)/
│   │   ├── index.tsx          # Home/Dashboard screen
│   │   ├── quizzes.tsx        # Quiz browsing screen
│   │   ├── settings.tsx       # Settings screen
│   │   ├── profile.tsx        # User profile screen
│   │   └── _layout.tsx        # Tab navigation
│   ├── quiz/
│   │   └── [id].tsx           # Dynamic quiz taking screen
│   ├── splash.tsx             # Splash/Loading screen
│   ├── _layout.tsx            # Root layout with routing logic
│   └── modal.tsx              # Modal screen template
├── assets/
│   └── data/
│       └── quizzes.json       # Quiz questions and answers
├── components/
│   ├── ui/
│   │   ├── glass-card.tsx     # Glassmorphic card component
│   │   ├── button.tsx         # Custom button component
│   │   ├── auth-input.tsx     # Authentication input field
│   │   ├── icon-symbol.tsx    # Icon utilities
│   │   ├── collapsible.tsx    # Collapsible component
│   │   └── icon-symbol.ios.tsx
│   ├── themed-text.tsx        # Theme-aware text component
│   ├── themed-view.tsx        # Theme-aware view component
│   ├── haptic-tab.tsx         # Haptic feedback for tabs
│   └── ... other components
├── constants/
│   └── theme.ts               # Enhanced theme with glassmorphism
├── hooks/
│   ├── use-app-theme.ts       # App theme hook
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── store/
│   └── auth-store.ts          # Zustand auth and quiz state
├── utils/
│   └── quiz-utils.ts          # Quiz utility functions
├── package.json               # Dependencies
└── app.json                   # Expo configuration
```

## 🎨 Design System

### Color Palette
- **Light Mode**: Modern light grays, indigo tint, accent pink
- **Dark Mode**: Deep grays, cyan tint, accent pink
- **Semantic Colors**: Success (green), Error (red), Warning (orange)

### Components
- **GlassCard** - Transparent glassmorphic card with adjustable intensity
- **Button** - Multiple variants (primary, secondary, outline, glass)
- **AuthInput** - Form input with icon support and error handling

### Spacing System
- `xs: 4px`, `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`, `xxl: 32px`, `xxxl: 40px`

### Border Radius
- `xs: 4px`, `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`, `full: 9999px`

## 🔐 Authentication Flow

1. **Splash Screen** - Shows while app initializes and checks user session
2. **Auth Check** - Determines if user is logged in
3. **Login/Signup** - If not authenticated, navigate to auth screens
4. **Main App** - If authenticated, show tab navigation with home screen

## 📊 Sample Quiz Data

The app includes 4 sample quizzes with different categories and difficulty levels:

1. **React Basics** - Beginner level (5 questions)
2. **JavaScript Advanced** - Intermediate level (5 questions)
3. **Web Security** - Intermediate level (5 questions)
4. **Mobile Development** - Beginner level (5 questions)

Each quiz includes:
- Question text
- 4 multiple-choice options
- Correct answer index
- Detailed explanation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Install dependencies
npm install

# Install additional packages for full features
npm install @react-native-async-storage/async-storage @react-native-google-signin/google-signin zustand

# Start the app
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Environment Setup

The app works with mock authentication by default. For real Google authentication:

1. Get your Google Client ID
2. Configure it in `app.json` under plugins
3. Install Google Sign-In library

## 🎯 Key Features Implementation

### State Management
Uses Zustand for efficient state management:
```typescript
const { user, theme, quizProgress, setUser, setTheme } = useAuthStore();
```

### Theme Switching
Switch between light, dark, and auto modes:
```typescript
const { setTheme } = useAuthStore();
setTheme('dark'); // or 'light' or 'auto'
```

### Quiz Tracking
Automatically saves quiz progress to local storage:
```typescript
const { addQuizProgress } = useAuthStore();
```

### Local Data
Quiz data is stored in JSON format and loaded at app startup:
```typescript
import { getAllQuizzes, getQuizById } from '@/utils/quiz-utils';
```

## 📱 Responsive Design

- **Mobile** - Optimized for phones (320px - 767px)
- **Tablet** - Adapted layout for larger screens (768px - 1024px)
- **Web** - Full responsive support with proper spacing

## ⚡ Performance Optimizations

- Memoized quiz filtering and calculations
- Lazy loading of quiz data
- Optimized re-renders with React hooks
- Efficient image handling with Expo Image

## 🎓 Learning Paths

The quiz categories are organized for learning:

1. **Frontend Development** - React, JavaScript fundamentals
2. **Backend Development** - Advanced JavaScript, best practices
3. **Security** - Web security concepts and vulnerabilities
4. **Mobile Development** - Mobile frameworks and concepts

## 🔄 Quiz Flow

1. **Browse** - Home screen shows recommended quizzes
2. **Select** - Choose from all available quizzes with filters
3. **Take** - Interactive quiz with progress tracking
4. **Review** - Detailed results with explanations
5. **Track** - Progress saved to profile

## 📈 Analytics

Dashboard displays:
- Total quizzes completed
- Average score percentage
- Perfect scores count
- Recent activity history

## 🛠️ Development

### Adding New Quizzes

Edit `assets/data/quizzes.json` and add:
```json
{
  "id": "unique-id",
  "title": "Quiz Title",
  "description": "Quiz description",
  "category": "Category",
  "difficulty": "Beginner|Intermediate|Advanced",
  "duration": 10,
  "questions": [...]
}
```

### Creating Custom Components

Use the provided theme system:
```typescript
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const themeColors = Colors[theme];
```

## 🐛 Troubleshooting

### Styling Not Applied
- Clear cache: `expo start --clear`
- Restart bundler

### Theme Not Switching
- Check AsyncStorage permissions
- Restart app after theme change

### Quiz Data Not Loading
- Verify JSON syntax in `quizzes.json`
- Check file path in imports

## 📝 Notes

- All quiz data is stored locally on the device
- No backend or database integration by default
- Google auth is mocked for demo purposes
- Progress persists between app sessions

## 🎯 Future Enhancements

- Backend integration for cloud sync
- Real Google authentication
- Leaderboards and multiplayer quizzes
- Achievement badges
- Timed quiz mode
- Voice-based questions
- Spaced repetition algorithm

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Built With

- **React Native** - Cross-platform mobile development
- **Expo** - React Native framework and tooling
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **Expo Router** - File-based routing
- **AsyncStorage** - Local data persistence

---

**Happy Learning! 🚀**
