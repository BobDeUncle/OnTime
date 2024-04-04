import React from 'react';
import {View} from 'react-native';
import MyText from '../components/MyText';
import {useTheme} from '../theme/Colors';

function HomeScreen({}): React.ReactElement {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.opText}}>This is Home Screen</MyText>
    </View>
  );
}

export default HomeScreen;
