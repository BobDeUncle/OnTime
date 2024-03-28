import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '.././theme/Colors';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card}}>
      <Text style={{color: colors.text}}>This is Home Screen</Text>
    </View>
  );
};

export default HomeScreen;
