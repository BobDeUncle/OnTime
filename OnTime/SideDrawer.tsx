/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import DashboardScreen from './screens/DashboardScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import TimesheetsScreen from './screens/TimesheetsScreen.tsx';
import {lightTheme, darkTheme, useTheme} from './theme/Colors.tsx';

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 0,
    flex: 1,
  },
});

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  handleLogout: () => void;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const {colors} = useTheme();
  const {handleLogout} = props;

  return (
    <View style={styles.mainContainer}>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={{color: colors.primary}}
        icon={() => (
          <FontAwesomeIcon
            icon="arrow-right-from-bracket"
            color={colors.primary}
          />
        )}
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();

interface SideDrawerProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  handleLogout: () => void;
}

function SideDrawer({
  isDarkMode,
  toggleTheme,
  handleLogout,
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
      }}
      drawerContent={props => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({color}) => (
            <FontAwesomeIcon icon="house" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Timesheets"
        component={TimesheetsScreen}
        options={{
          drawerIcon: ({color}) => (
            <FontAwesomeIcon icon="clock" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          drawerIcon: ({color}) => (
            <FontAwesomeIcon icon="user" color={color} />
          ),
        }}>
        {() => (
          <ProfileScreen />
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Settings"
        options={{
          drawerIcon: ({color}) => (
            <FontAwesomeIcon icon="gear" color={color} />
          ),
        }}>
        {() => (
          <SettingsScreen isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default SideDrawer;
