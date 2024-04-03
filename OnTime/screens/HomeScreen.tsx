import React from 'react';
import {Button, View, Text} from 'react-native';
import {useTheme} from '../theme/Colors';

interface HomeScreenProps {
  handleLogout: () => void;
}

function HomeScreen({handleLogout}: HomeScreenProps): React.ReactElement {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.background}}>
      <Text style={{color: colors.text}}>This is Home Screen</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

export default HomeScreen;
