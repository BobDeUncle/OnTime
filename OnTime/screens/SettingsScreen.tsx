import React from 'react';
import {View, Text, Switch} from 'react-native';
import {useTheme} from '.././theme/Colors';
import styles from '.././theme/Styles';

interface SideDrawerProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

function SettingsScreen({
  isDarkMode,
  toggleTheme,
}: SideDrawerProps): React.ReactElement {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card}}>
      <Text style={styles.text}>This is Settings Screen</Text>
      <View style={styles.leftContainer}>
        <Text style={styles.text}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

export default SettingsScreen;
