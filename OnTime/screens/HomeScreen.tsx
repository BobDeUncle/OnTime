import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '.././theme/Colors';
import TimeRecordList from '../components/time-record/time-record-list';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card}}>
      <Text style={{color: colors.text}}>This is Home Screen</Text>
      <TimeRecordList />
    </View>
  );
};

export default HomeScreen;
