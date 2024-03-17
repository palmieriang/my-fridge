# my-fridge

----------

Used React Native to develop an app which allows to track products inside the fridge/freezer monitoring the expiring date. Implemented create user/login functionality; localization (English, Italian and French), used Google Firebase for storing authentication details, products list and user's profile image.

----------

`yarn install`

`yarn start`

----------

# Install EAS CLI:
First, you'll need to install the EAS CLI if you haven't already. You can install it globally using npm or yarn:

`npm install -g eas-cli`

or

`yarn global add eas-cli`

If you're encountering a "command not found" error after installing eas-cli, it's possible that the binary directory where eas is installed is not included in your system's PATH environment variable.

`yarn global bin`

`export PATH="$PATH:<global_bin_directory>"`

# Build for Android with EAS:
Once you have the EAS CLI installed, you can use the following command to start the build process for your Android app:

`eas build -p android`

# Notes

Show inspector in Android Emulator shortcut `CMD + M`

# Install and configure local emulator
Install [firebase-cli](https://firebase.google.com/docs/cli#install-cli-mac-linux)

Follow [https://firebase.google.com/docs/emulator-suite/install_and_configure](https://firebase.google.com/docs/emulator-suite/install_and_configure)

Run emulators importing local data

`firebase emulators:start --import=./firebase-emulators-data`

Export data from emulators

Run the emulator and run this command in a different window

`firebase emulators:export ./firebase-emulators-data`
