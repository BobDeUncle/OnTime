import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '.././theme/Colors';

const SettingsScreen = () => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card}}>
      <Text style={{color: colors.text}}>This is Settings Screen</Text>
    </View>
  );
};

export default SettingsScreen;
