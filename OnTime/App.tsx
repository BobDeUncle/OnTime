import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {lightTheme, darkTheme} from './theme/Colors';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SideDrawer from './SideDrawer';

function App(): React.JSX.Element {
  // OneSignal for Push Notifications
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

  // const theme = useColorScheme();

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

  // toggleTheme();

  return (
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
      <SideDrawer isDarkMode={isDarkMode} />
    </NavigationContainer>
  );
}

export default App;
