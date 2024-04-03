import React from 'react';
import {Button, View} from 'react-native';
import MyText from '../components/MyText';
import {useTheme} from '../theme/Colors';

interface HomeScreenProps {
  handleLogout: () => void;
}

function HomeScreen({handleLogout}: HomeScreenProps): React.ReactElement {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.opText}}>This is Home Screen</MyText>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

export default HomeScreen;
