import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { useAPIClient } from './api/APIClientContext';
import {lightTheme, darkTheme} from './theme/Colors';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCustomText} from 'react-native-global-props';
import SplashScreen from 'react-native-splash-screen';

import SideDrawer from './SideDrawer';
import LoginScreen from './screens/LoginScreen.tsx';

import './assets/fontAwesomeImports';

function App(): React.JSX.Element {
  // OneSignal for Push Notifications
  // For when we get back-end connected
  // https://medium.com/tribalscale/mobile-push-notifications-implementation-in-react-native-with-one-signal-4e810dddd350
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('62fe518c-74b6-48ed-9973-37a81eb1d4b8');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // OneSignal.Notifications.requestPermission(true);
  // In-App Message setup at OneSignal.com / Messages / In-App

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  // THEMING
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Load theme preference from AsyncStorage
    AsyncStorage.getItem('theme').then(storedTheme => {
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    // Save the theme preference to AsyncStorage
    AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Font Theme
  const customTextProps = {
    style: {
      fontFamily: 'Open Sans',
    },
  };

  setCustomText(customTextProps);

  // AUTHENTICATION using userToken
  const { isAuthenticated, setIsAuthenticated } = useAPIClient();

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    AsyncStorage.getItem('userToken').then(token => {
      if (token) {
        setIsAuthenticated(true);
      }
      SplashScreen.hide();
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
      {isAuthenticated ? (
        <SideDrawer
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}

export default App;
