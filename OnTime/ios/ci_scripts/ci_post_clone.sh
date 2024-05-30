#!/bin/sh
# This script is run after the repository is cloned

# Install Homebrew if not installed
if ! command -v brew &> /dev/null
then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install CocoaPods using Homebrew
echo "Installing CocoaPods..."
brew install cocoapods

# Navigate to the project directory
cd ios

# Install the pods
echo "Running pod install..."
pod install
