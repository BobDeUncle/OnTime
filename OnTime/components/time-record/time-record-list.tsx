/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import MyText from '../../components/MyText';
import { storageEmitter } from '../storageEmitter';

import APIClient from '../../api/APIClient';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import TimeRecord from '../../models/TimeRecord';
import TimeRecordItem from './time-record';

const TimeRecordList: React.FC = () => {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);

  const refreshList = () => {
    fetchTimeRecords();
  }

  const fetchTimeRecords = useCallback(async () => {
    setLoading(true);
    try {
      const timeRecordsData: TimeRecord[] =
        await timeRecordAPI.getAllTimeRecords();

      setTimeRecords(timeRecordsData);
    } catch (error) {
      console.error('Error fetching time records:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRecordAPI]);

  useEffect(() => {
    // Fetch time records when the component mounts
    fetchTimeRecords();

    // Listen for the 'timeRecordsUpdated' event
    storageEmitter.on('timeRecordsUpdated', refreshList);

    // Cleanup function
    return () => {
      // Remove the event listener when the component unmounts
      storageEmitter.off('timeRecordsUpdated', refreshList);
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <MyText style={{fontSize: 24, marginBottom: 16}}>Time Records</MyText>
      <FlatList
        scrollEnabled={false}
        data={timeRecords}
        renderItem={({item}) => (
          <TimeRecordItem
            timeRecord={item}
            fetchTimeRecords={fetchTimeRecords}
            refreshList={refreshList}
          />
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default TimeRecordList;
