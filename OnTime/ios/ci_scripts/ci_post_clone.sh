#!/bin/sh

# Install Homebrew if not installed
if ! command -v brew &> /dev/null
then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js..."
    brew install node
fi

# Install Yarn
if ! command -v yarn &> /dev/null
then
    echo "Yarn not found. Installing Yarn..."
    brew install yarn
fi

# Install CocoaPods using Homebrew
echo "Installing CocoaPods..."
brew install cocoapods

# Navigate to the project directory
cd /Volumes/workspace/repository/OnTime/ios

# Install project dependencies
echo "Running yarn install..."
yarn install

# Install the pods
echo "Running pod install..."
pod install
