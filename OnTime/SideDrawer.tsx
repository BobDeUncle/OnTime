import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useWindowDimensions} from 'react-native';

import HomeScreen from './screens/HomeScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import {lightTheme, darkTheme} from './theme/Colors.tsx';

const Drawer = createDrawerNavigator();

interface SideDrawerProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

function SideDrawer({
  isDarkMode,
  toggleTheme,
}: SideDrawerProps): React.ReactElement {
  const dimensions = useWindowDimensions();

  const drawerStyles = {
    backgroundColor: isDarkMode
      ? darkTheme.colors.background
      : lightTheme.colors.background,
  };

  const screenStyles = {
    drawerActiveTintColor: isDarkMode
      ? darkTheme.colors.focus
      : lightTheme.colors.focus,
    drawerInactiveTintColor: isDarkMode
      ? darkTheme.colors.primary
      : lightTheme.colors.primary,
    drawerActiveBackgroundColor: isDarkMode
      ? darkTheme.colors.card
      : lightTheme.colors.card,
    drawerInactiveBackgroundColor: isDarkMode
      ? darkTheme.colors.background
      : lightTheme.colors.background,
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        drawerStyle: drawerStyles,
        ...screenStyles,
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings">
        {() => (
          <SettingsScreen isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

export default SideDrawer;