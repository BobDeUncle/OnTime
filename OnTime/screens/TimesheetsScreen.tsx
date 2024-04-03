import React from 'react';
import {ScrollView} from 'react-native';
import MyText from '../components/MyText';
import {useTheme} from '../theme/Colors';
import TimeRecordList from '../components/time-record/time-record-list';
import NewTimeRecordButton from '../components/time-record/time-record-modal-button';

const HomeScreen = () => {
  const {colors} = useTheme();

  return (
    <ScrollView style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.text}}>This is Home Screen</MyText>
      <TimeRecordList />
      <NewTimeRecordButton />
    </ScrollView>
  );
};

export default HomeScreen;
