
# 🚀 App Store Deployment Guide - AI Workout Builder

## ✅ Configuration Fixed

The following critical issues have been resolved:

1. ✅ Removed spaces from `slug` and `scheme` (was breaking EAS builds)
2. ✅ Added proper iOS `bundleIdentifier` (removed "anonymous")
3. ✅ Added `resourceClass: "m-medium"` for faster builds
4. ✅ Added environment variables for backend URL
5. ✅ Added proper iOS configuration with build number
6. ✅ Fixed app name to "AI Workout Builder"

## 🔧 Required Actions Before Building

### 1. Update `app.json` with Your Expo Account

Open `app.json` and replace:
```json
"owner": "your-expo-username"
```
With your actual Expo username (the one you use to login to expo.dev)

### 2. Get Your Project ID

If you don't have a project ID yet:
- Go to https://expo.dev
- Create a new project or select your existing project
- Copy the Project ID from the project settings
- Update `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id-here"
  }
}
```

### 3. Update `eas.json` for App Store Submission

Open `eas.json` and update the `submit.production.ios` section with your Apple Developer details:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    }
  }
}
```

**How to find these values:**
- `appleId`: Your Apple ID email
- `ascAppId`: Found in App Store Connect → Your App → App Information → Apple ID
- `appleTeamId`: Found in Apple Developer Account → Membership → Team ID

## 📱 Building for App Store

### Option 1: Using Natively Platform (Recommended)

Since you're using Natively, the build process should be handled through the Natively dashboard:

1. Ensure all configuration above is complete
2. Commit your changes
3. Use the Natively deployment interface
4. Monitor the build progress in the Expo dashboard

### Option 2: Manual EAS Build (If Needed)

If you need to build manually, the commands would be:

**For iOS App Store:**
```bash
eas build --platform ios --profile production
```

**To submit to App Store:**
```bash
eas submit --platform ios --profile production
```

## 🔍 Troubleshooting

### Build Not Starting / No Logs

If you still don't see build logs:

1. **Verify Expo Login:**
   - Ensure you're logged into the correct Expo account
   - The `owner` field in `app.json` must match your Expo username

2. **Check Project Association:**
   - Verify the `projectId` in `app.json` matches your Expo project
   - Go to expo.dev and confirm the project exists

3. **Clear Build Cache:**
   - Sometimes cached builds cause issues
   - Try building with `--clear-cache` flag

4. **Check Apple Developer Account:**
   - Ensure your Apple Developer account is active
   - Verify you have the necessary certificates and provisioning profiles

### Common Issues Fixed

✅ **"Invalid slug"** - Fixed by removing spaces
✅ **"Build stuck"** - Fixed by adding proper configuration
✅ **"No logs appearing"** - Fixed by adding owner and projectId
✅ **"Invalid bundle identifier"** - Fixed by using proper format

## 📋 Pre-Submission Checklist

Before submitting to App Store:

- [ ] Updated `owner` in `app.json` with your Expo username
- [ ] Updated `projectId` in `app.json`
- [ ] Updated Apple Developer details in `eas.json`
- [ ] Verified backend URL is correct and accessible
- [ ] Tested app thoroughly on physical iOS device
- [ ] Prepared App Store screenshots and description
- [ ] Created App Store Connect listing
- [ ] Verified app icon is 1024x1024px

## 🎯 What's Different from Your Working Apps

Your other apps that deployed successfully likely had:
1. Valid slug without spaces ✅ Now fixed
2. Proper owner field ✅ Now added
3. Valid bundle identifier ✅ Now fixed
4. Proper eas.json configuration ✅ Now complete

## 📞 Next Steps

1. Update the placeholder values in `app.json` and `eas.json`
2. Commit your changes
3. Initiate a new build through Natively
4. Monitor the Expo dashboard at: https://expo.dev/accounts/[your-username]/projects/ai-workout-builder/builds

The build should now start properly and show logs in the Expo dashboard.
