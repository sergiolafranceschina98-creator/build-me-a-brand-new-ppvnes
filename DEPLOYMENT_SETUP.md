
# 🚀 Deployment Setup Guide - AI Workout Builder

## ⚠️ CRITICAL: Required Configuration

The deployment configuration has been fixed, but you **MUST** manually fill in the following placeholder values before deploying:

---

## 📝 Step 1: Update `app.json`

Open `app.json` and replace these placeholder values:

### 1. Expo Username (Line 44)
```json
"owner": "your-expo-username"
```
**Replace with:** Your Expo account username (found at https://expo.dev/accounts/[username])

### 2. EAS Project ID (Line 48)
```json
"projectId": "your-eas-project-id"
```
**How to get this:**
- Go to https://expo.dev
- Create a new project or select existing project
- Copy the Project ID from the project settings
- It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## 📝 Step 2: Update `eas.json` (For App Store Submission)

Open `eas.json` and replace these values in the `submit.production.ios` section:

### 1. Apple ID (Line 38)
```json
"appleId": "your-apple-id@email.com"
```
**Replace with:** Your Apple Developer account email

### 2. App Store Connect App ID (Line 39)
```json
"ascAppId": "your-app-store-connect-app-id"
```
**How to get this:**
- Go to https://appstoreconnect.apple.com
- Select your app
- The App ID is in the URL: `https://appstoreconnect.apple.com/apps/[APP_ID]/appstore`
- It's a numeric ID like: `1234567890`

### 3. Apple Team ID (Line 40)
```json
"appleTeamId": "your-apple-team-id"
```
**How to get this:**
- Go to https://developer.apple.com/account
- Click "Membership" in the sidebar
- Your Team ID is displayed (10 characters, like: `ABC123XYZ9`)

---

## ✅ Verification Checklist

Before deploying, ensure:

- [ ] `app.json` → `owner` is set to your Expo username
- [ ] `app.json` → `extra.eas.projectId` is set to your EAS project ID
- [ ] `eas.json` → `submit.production.ios.appleId` is set to your Apple ID email
- [ ] `eas.json` → `submit.production.ios.ascAppId` is set to your App Store Connect App ID
- [ ] `eas.json` → `submit.production.ios.appleTeamId` is set to your Apple Team ID
- [ ] You have an active Apple Developer Program membership ($99/year)
- [ ] You have created an app in App Store Connect with bundle ID: `com.aiworkoutbuilder.app`

---

## 🎯 What Was Fixed

The critical error you were seeing:
```
Invalid input: expected string, received undefined
- path: ["name"]
- path: ["bundleId"]
```

This was caused by **missing EAS configuration fields** (`owner` and `projectId`). Without these, EAS couldn't properly validate the app configuration, leading to the misleading error about `name` and `bundleId`.

**Fixed:**
- ✅ Added `owner` field to `app.json`
- ✅ Added `extra.eas.projectId` to `app.json`
- ✅ Added complete iOS submission configuration to `eas.json`
- ✅ Ensured `name` and `ios.bundleIdentifier` are properly set

---

## 🚀 Next Steps

1. **Fill in the placeholder values** in `app.json` and `eas.json` as described above
2. **Verify your configuration** using the checklist
3. **Deploy to Expo** - The app should now build successfully
4. **Monitor the build** - You should now see logs in the Expo dashboard

---

## 📞 Need Help?

- **Expo Documentation:** https://docs.expo.dev/build/introduction/
- **EAS Build:** https://docs.expo.dev/build/setup/
- **App Store Submission:** https://docs.expo.dev/submit/ios/

---

**Status:** ✅ Configuration files are now properly structured. Fill in the placeholder values and you're ready to deploy!
