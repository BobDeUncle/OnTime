import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useWindowDimensions} from 'react-native';
import { LogLevel, OneSignal } from 'react-native-onesignal';

import HomeScreen from './screens/HomeScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import LoginScreen from './screens/LoginScreen.js';

const Drawer = createDrawerNavigator();

// Based off of https://reactnavigation.org/docs/drawer-navigator/#example
function SideDrawer() {
  const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

function App(): React.JSX.Element {
  // OneSignal for Push Notifications
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('62fe518c-74b6-48ed-9973-37a81eb1d4b8');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  return (
    <NavigationContainer>
      <SideDrawer />
    </NavigationContainer>
  );
}

export default App;
