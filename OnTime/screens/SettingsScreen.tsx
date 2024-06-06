import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useTheme } from '.././theme/Colors';
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
  const { colors } = useTheme();

  const localStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    text: {
      color: colors.text,
      fontSize: 16,
    },
  });

  return (
    <View style={localStyles.container}>
      <View style={localStyles.card}>
        <MyText style={localStyles.text}>Dark Mode</MyText>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

export default SettingsScreen;
