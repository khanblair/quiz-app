# Quiz App - Setup & Testing Instructions

## Quick Start

Your Quiz App has been successfully configured with:
✅ Convex database integration with Clerk authentication
✅ User data synchronization between Clerk and Convex
✅ Account deletion functionality
✅ Complete notifications system

## Prerequisites

All required packages are already installed:
- `convex@1.29.1`
- `convex-helpers@0.1.104`
- `@clerk/clerk-expo@2.18.3`

## Environment Setup

Verify your `.env.local` file has these variables (already configured):
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER=https://wondrous-mite-39.clerk.accounts.dev
EXPO_PUBLIC_CONVEX_URL=https://mellow-seahorse-30.convex.cloud
CONVEX_DEPLOYMENT=dev:mellow-seahorse-30
```

## Running the App

1. **Start Convex Dev Server** (if not already running):
   ```bash
   npx convex dev
   ```

2. **Start Expo**:
   ```bash
   npm start
   ```

3. **Run on Device**:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code for physical device

## Testing Guide

### 1. Authentication & User Sync

**Test Signup:**
1. Open the app → Go to "Sign Up"
2. Create an account with email/password OR use Google Sign-In
3. Complete email verification (for email/password)
4. ✅ Verify: Check Convex dashboard to see your user was created

**Test Login:**
1. Sign out from the app
2. Sign back in with your credentials
3. ✅ Verify: lastLoginAt should update in Convex dashboard

**Test User Data:**
- Open Convex dashboard: https://dashboard.convex.dev
- Navigate to your project → Data → `users` table
- You should see your user with:
  - `clerkId`
  - `email`
  - `name`
  - `role` (first user is "admin", rest are "user")
  - `createdAt` and `lastLoginAt` timestamps

### 2. Notifications System

**Create Test Notifications:**

Since you're the first user (admin), you can create test notifications using the Convex dashboard:

1. Go to Convex Dashboard → Data → `notifications` table
2. Click "Insert Document"
3. Add a notification:
   ```json
   {
     "userId": "your-clerk-id-here",
     "title": "Welcome!",
     "message": "This is your first notification",
     "type": "system",
     "read": false,
     "createdAt": 1700000000000
   }
   ```

**Test Notification Features:**
1. ✅ Check notification bell icon on Home screen (should show count)
2. ✅ Click bell → Navigate to notifications screen
3. ✅ See your notification with unread indicator
4. ✅ Tap notification → Should mark as read
5. ✅ Pull to refresh → List updates
6. ✅ Click "Mark all as read" → All notifications marked
7. ✅ Delete a notification → Should disappear

**Alternative: Create via API**
You can also create notifications programmatically by calling the mutation from your app or a script.

### 3. Account Deletion

**Test Delete Account:**
1. Go to Profile tab
2. Scroll down to "Delete Account" button (red, at bottom)
3. Click "Delete Account"
4. ✅ Confirm deletion in dialog (reads warning message)
5. Click "Delete" in confirmation
6. ✅ Verify: App shows "Account Deleted" message
7. ✅ Verify: Redirected to login screen
8. ✅ Verify in Convex Dashboard:
   - User removed from `users` table
   - All user notifications removed from `notifications` table
9. ✅ Verify in Clerk Dashboard:
   - User account deleted

**IMPORTANT:** Create a test account for deletion testing, don't delete your primary account!

### 4. Navigation & UI

**Test Tabs:**
1. ✅ Home tab: Shows quiz dashboard + notification bell
2. ✅ Quizzes tab: Browse available quizzes
3. ✅ Notifications tab: Full notification list
4. ✅ Settings tab: App settings
5. ✅ Profile tab: User profile + stats + delete account

**Test Notification Bell:**
1. ✅ Shows correct unread count
2. ✅ Updates in real-time when notifications change
3. ✅ Badge displays "99+" for counts over 99
4. ✅ Navigates to notifications screen on tap

## Common Issues & Solutions

### Issue: "ConvexProviderWithClerk not found"
**Solution:** Already handled. Using `convex/react-clerk` import which is available in `convex@1.29.1`.

### Issue: Notifications not showing
**Solution:** 
- Check you're logged in (auth required)
- Create a test notification with your userId
- Verify Convex connection in app logs

### Issue: User not syncing to Convex
**Solution:**
- Check Convex dev server is running
- Check JWT issuer in `convex/auth.config.ts` matches Clerk
- Check network requests in browser/app dev tools

### Issue: Account deletion fails
**Solution:**
- Ensure you're authenticated
- Check Convex logs for errors
- Verify Clerk user can be deleted (not already deleted)

## API Endpoints Created

### Mobile API (convex/mobile/)
**Notifications:**
- `getUserNotifications()` - Get all user notifications (authenticated)
- `getUnreadCount()` - Get unread count (authenticated)
- `markAsRead({ _id })` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification({ _id })` - Delete notification

**Users:**
- `upsertUser({ clerkId, email, name, imageUrl })` - Create/update user
- `deleteUserAccount()` - Delete user and all data

### Web API (convex/web/)
**Notifications (Admin):**
- `getUserNotifications({ userId })` - Get user notifications (admin)
- `getUnreadCount({ userId })` - Get unread count (admin)
- `createNotification({ userId, title, message, type, quizId? })` - Create
- `broadcastNotification({ userIds, title, message, type, quizId? })` - Send to multiple users

## File Checklist

**New Files Created:**
- ✅ `app/(tabs)/notifications.tsx`
- ✅ `components/ui/notification-bell.tsx`
- ✅ `components/ui/notification-list.tsx`
- ✅ `convex/mobile/notifications.ts`
- ✅ `convex/users.ts` (was untracked, now properly configured)
- ✅ `IMPLEMENTATION_SUMMARY.md`
- ✅ `SETUP_INSTRUCTIONS.md` (this file)

**Modified Files:**
- ✅ `app/_layout.tsx` - Added ConvexProviderWithClerk
- ✅ `app/(auth)/login.tsx` - Added user sync
- ✅ `app/(auth)/signup.tsx` - Added user sync
- ✅ `app/(tabs)/_layout.tsx` - Added notifications tab + bell
- ✅ `app/(tabs)/profile.tsx` - Added delete account button
- ✅ `package.json` - Added convex-helpers

## Next Steps

1. **Test everything** using the guide above
2. **Create more notification types** (quiz completed, achievements, etc.)
3. **Add push notifications** (requires Expo notifications setup)
4. **Customize notification types** in `notification-list.tsx`
5. **Add profile editing** (update name, email, image)
6. **Create admin panel** to manage users and send broadcast notifications

## Support

If you encounter issues:
1. Check Convex logs: `npx convex dev` output
2. Check app logs in Metro bundler
3. Check Clerk dashboard for auth issues
4. Review `IMPLEMENTATION_SUMMARY.md` for technical details

## Security Notes

✅ All Convex queries use Clerk JWT authentication
✅ Users can only access their own data
✅ Account deletion is properly secured
✅ No sensitive data exposed in client code
✅ Environment variables properly configured

## Performance Notes

✅ Real-time updates via Convex reactivity
✅ Efficient queries with proper indexes
✅ Optimistic UI updates for better UX
✅ Pull-to-refresh for manual sync
✅ Loading states throughout

---

**Implementation completed successfully!** 🎉

Your app now has:
- Full authentication with Clerk + Convex
- Secure account deletion
- Complete notifications system
- Real-time data synchronization
- Mobile-first responsive design
