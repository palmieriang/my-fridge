# 🧊 My Fridge

A React Native (Expo Bare Workflow) app to manage food inventory in your fridge or freezer, helping you track expiration dates and reduce waste.

---

## ✨ Features

- 🔐 Firebase Authentication (email/password)
- 🧃 Track fridge/freezer contents
- 🗓️ Monitor expiry dates
- 🗂️ Upload profile images to Firebase Storage
- 🌍 Multi-language support: 🇬🇧 English, 🇮🇹 Italian, 🇫🇷 French
- 🔁 Local development powered by Firebase Emulator Suite

---

## 🚀 Getting Started

### 1. Install dependencies

```
yarn install
```

### 2. Start Expo

```
yarn start
```

### 3. Start Firebase Emulators (optional, but recommended for dev)

```
firebase emulators:start --import=./firebase-emulators-data
```

ℹ️ Emulator usage is enabled by default in `src/firebase/config.js`.
Modify it if you want to connect to live Firebase services instead.

## 🧪 Firebase Emulator Management

### Export current emulator state

```
firebase emulators:export ./firebase-emulators-data
```

Run this after modifying Firestore/Auth data locally to preserve it.

### Import saved emulator data

```
firebase emulators:start --import=./firebase-emulators-data
```

## 🔧 Firebase Setup (Emulator + Bare Workflow)

### Install Firebase CLI

https://firebase.google.com/docs/cli#install-cli-mac-linux

### Initialize Emulator Suite

```
firebase init emulators
```

### Prebuild the project (required once for Bare Workflow)

```
npx expo prebuild
```

### Add native Firebase config files:

Place `google-services.json` in: `android/app/`

Place `GoogleService-Info.plist` in: `ios/`

### Reference them in `app.json` or `app.config.js`:

```
{
  "android": {
    "googleServicesFile": "./android/app/google-services.json"
  },
  "ios": {
    "googleServicesFile": "./ios/GoogleService-Info.plist"
  }
}
```

## 📱 Native Build with EAS

### 1. Install EAS CLI

```
yarn global add eas-cli
# or
npm install -g eas-cli
```

If eas is not found:

```
yarn global bin
# Then:
export PATH="$PATH:<output_path>"
```

### 2. Authenticate with EAS

```
eas login
```

### 3. Build for Android

```
eas build -p android
```

### 4. Submit to Google Play

```
eas submit -p android
```

For full instructions: https://docs.expo.dev/build/setup/

## 🧰 Developer Tips

* Show React Native dev menu in Android Emulator: Cmd + M (macOS) / Ctrl + M (Windows/Linux)

* Translations are in the localization/ folder

* Profile images are saved in Firebase Storage under profileImages/

* Firebase Emulator ports (by default):

  * Auth: 9099
  * Firestore: 8080
  * Storage: 9199

## 📦 Dependencies Overview

expo — managed workflow base

@react-native-firebase/app, auth, firestore, storage — Firebase SDK for native modules

firebase — not used anymore; remove if still present

@react-native-async-storage/async-storage — needed only if you re-enable Firebase JS SDK

## ✅ Status

* ✅ Firebase emulator support

* ✅ EAS builds (Android tested)

* 🔜 Tests
