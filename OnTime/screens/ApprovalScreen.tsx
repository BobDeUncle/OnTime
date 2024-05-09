import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../theme/Colors';
import styles from '../theme/Styles';
import MyText from '../components/MyText';

function ApprovalScreen(): React.ReactElement {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.opText}}>This is Approval Screen</MyText>
    </View>
  );
}

export default ApprovalScreen;
