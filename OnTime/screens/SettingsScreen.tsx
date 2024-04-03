import React from 'react';
import {View, Switch} from 'react-native';
import {useTheme} from '.././theme/Colors';
import styles from '.././theme/Styles';
import MyText from '../components/MyText';

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
    <View style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.opText}}>This is Settings Screen</MyText>
      <View style={styles.leftContainer}>
        <MyText style={{color: colors.opText}}>Dark Mode</MyText>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

export default SettingsScreen;
