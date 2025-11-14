# Quick Start: Convex Setup for Quiz App

This guide will help you get the Quiz App running with Convex database.

## Prerequisites

- Node.js installed
- Quiz App repository cloned
- Convex already installed (check `package.json`)

## Step-by-Step Setup

### 1. Start Convex Development Server

```bash
npx convex dev
```

This will:
- Create a Convex deployment if you don't have one
- Add `EXPO_PUBLIC_CONVEX_URL` to your `.env.local` file
- Start watching for code changes

### 2. Seed the Database

After Convex dev server is running, in a **new terminal**:

```bash
npx convex run seed:seedQuizzes
```

This will migrate all quizzes from `assets/data/quizzes.json` to your Convex database.

### 3. Start the Mobile App

In another terminal:

```bash
npm start
```

Or for specific platforms:

```bash
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For web
```

### 4. Verify Setup

Open the app and check that quizzes are loading. You should see the quiz list on the "Quizzes" tab.

## File Structure

```
quiz-app/
├── convex/
│   ├── schema.ts              # Database schema
│   ├── seed.ts                # Migration script
│   ├── web/                   # Admin functions
│   │   └── quizzes.ts        
│   └── mobile/                # Mobile app functions
│       └── quizzes.ts        
├── hooks/
│   └── use-quizzes.ts        # Custom React hooks for Convex
├── utils/
│   └── quiz-utils-convex.ts  # Updated utilities
└── app/
    ├── _layout.tsx           # ConvexProvider added here
    ├── (tabs)/
    │   ├── index.tsx         # Uses Convex hooks
    │   └── quizzes.tsx       # Uses Convex hooks
    └── quiz/
        └── [id].tsx          # Uses Convex hooks
```

## Key Changes from Static JSON

### Before (Static JSON)
```typescript
import { getAllQuizzes } from '@/utils/quiz-utils';

function QuizzesScreen() {
  const quizzes = getAllQuizzes(); // Synchronous
  // ...
}
```

### After (Convex)
```typescript
import { useAllQuizzes } from '@/hooks/use-quizzes';

function QuizzesScreen() {
  const quizzes = useAllQuizzes(); // Async, returns undefined while loading
  
  if (!quizzes) return <Loading />;
  // ...
}
```

## Admin Functions vs Mobile Functions

### Admin Functions (`convex/web/quizzes.ts`)
- Full CRUD operations
- Create, update, delete quizzes
- Get statistics
- Bulk operations
- **Use these for admin dashboard**

### Mobile Functions (`convex/mobile/quizzes.ts`)
- Read-only queries
- Get quizzes
- Search and filter
- **Use these in the mobile app**

## Common Commands

```bash
# Start Convex dev server (keep running)
npx convex dev

# Seed database with quiz data
npx convex run seed:seedQuizzes

# Clear all quizzes (careful!)
npx convex run seed:clearAllQuizzes

# View Convex logs
npx convex logs

# Deploy to production
npx convex deploy
```

## Troubleshooting

### App shows "Loading..." forever
1. Check that Convex dev server is running
2. Check that `.env.local` has `EXPO_PUBLIC_CONVEX_URL`
3. Restart the Expo dev server

### "No quizzes found"
1. Run the seed script: `npx convex run seed:seedQuizzes`
2. Check Convex dashboard at https://dashboard.convex.dev

### Changes not reflecting
1. Convex functions are hot-reloaded automatically
2. For React Native changes, reload the app (press 'r' in Expo terminal)

## Environment Variables

Your `.env.local` should have:

```env
# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk (existing)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Next Steps

1. ✅ Database is set up with Convex
2. ✅ Mobile app fetches from Convex
3. 🔜 Create admin dashboard using web functions
4. 🔜 Add authentication to admin functions
5. 🔜 Add real-time features

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Convex + React Native Guide](https://docs.convex.dev/client/react-native)
- Full documentation: See `convex/README.md`

## Questions?

- Check `convex/README.md` for detailed documentation
- Visit Convex Discord: https://convex.dev/community
