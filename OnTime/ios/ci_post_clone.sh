#!/bin/sh

# fail if any command fails
set -e
# debug log
set -x

# Install CocoaPods using Homebrew.
HOMEBREW_NO_AUTO_UPDATE=1 # disable homebrew's automatic updates.
brew install cocoapods

# Install Flutter using git.
git clone https://github.com/flutter/flutter.git -b stable $HOME/flutter
export PATH="$PATH:$HOME/flutter/bin"

# Install Flutter artifacts for iOS (--ios), or macOS (--macos) platforms.
flutter precache --ios

# Install Flutter dependencies.
flutter channel master
flutter doctor
flutter pub get

# Generate IOS file
flutter build ios --release --no-codesign

# Install CocoaPods dependencies.
#cd ios && pod install # run `pod install` in the `ios` directory.

exit 0
