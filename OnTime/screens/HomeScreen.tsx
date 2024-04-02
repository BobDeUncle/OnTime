import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '.././theme/Colors';
import TimeRecordList from '../components/time-record/time-record-list';
import NewTimeRecordButton from '../components/time-record/time-record-modal-button';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card}}>
      <Text style={{color: colors.text}}>This is Home Screen</Text>
      <TimeRecordList />
      <NewTimeRecordButton />
    </View>
  );
};

export default HomeScreen;
