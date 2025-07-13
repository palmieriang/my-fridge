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

### 0. Node.js Version (Recommended)

This project is built and tested with Node.js LTS version `18.20.6`.
It is highly recommended to use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

Once nvm is installed:

```
# Navigate to the project root
cd /path/to/my-fridge

# This command will read the .nvmrc file and switch to the recommended Node.js version
nvm use
```

If you don't have Node.js 18.20.6 installed via nvm, you will be prompted to install it.

```
nvm install 18.20.6
nvm use
```

### 1. Install dependencies

```
yarn install
```

### 2. Start Expo

Ensure you are using the correct Node.js version (see step 0), then start the development server:

```
yarn start
```
or
```
 npx expo run:android 
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

[https://firebase.google.com/docs/cli#install-cli-mac-linux](https://firebase.google.com/docs/cli#install-cli-mac-linux)

### Initialize Emulator Suite

```
firebase init emulators
```

### Configure Android SDK Location

Ensure your `ANDROID_HOME` environment variable is set to your Android SDK path (e.g., `/Users/yourusername/Library/Android/sdk`).
Add the following to your shell's configuration file (e.g., `~/.zshrc` or `~/.bash_profile`):

```
export ANDROID_HOME=/Users/yourusername/Library/Android/sdk # Replace with your actual path
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

### Prebuild the project

This command generates the `android/` and `ios/` native directories. It should be run whenever `app.json` or native dependencies change, or on a fresh clone before running native builds.

```
npx expo prebuild --clean
```

### Add native Firebase config files:

Place `google-services.json` and `GoogleService-Info.plist` in the project root


These files are sensitive and must not be committed.

⚠️ Placeholders for these files already exist in the repo to prevent build errors.

To ensure your local versions are not accidentally committed, run:

```
git update-index --assume-unchanged google-services.json
git update-index --assume-unchanged GoogleService-Info.plist
```

If you ever need to re-track changes to these files:

```
git update-index --no-assume-unchanged google-services.json
git update-index --no-assume-unchanged GoogleService-Info.plist
```

### Reference them in `app.json` or `app.config.js`:

```
{
  "android": {
    "googleServicesFile": "./google-services.json"
  },
  "ios": {
    "googleServicesFile": "./GoogleService-Info.plist"
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

## ✅ Status

* ✅ Firebase emulator support

* ✅ EAS builds (Android tested)

* 🔜 Tests
