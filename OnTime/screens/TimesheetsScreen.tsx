import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {useTheme} from '../theme/Colors';
import TimeRecordList from '../components/time-record/time-record-list';
import NewTimeRecordButton from '../components/time-record/time-record-modal-button';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <ScrollView style={{backgroundColor: colors.background}}>
      <Text style={{color: colors.text}}>This is Home Screen</Text>
      <TimeRecordList />
      <NewTimeRecordButton />
    </ScrollView>
  );
};

export default HomeScreen;
