import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import APIClient from '../../api/APIClient';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import TimeRecord from '../../models/TimeRecord';
import TimeRecordItem from './time-record';

const TimeRecordList: React.FC = () => {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // filtering controls
  // const [selectedEmployees, setSelectedEmployees] = useState<User[]>([]);
  // const [selectedJobsites, setSelectedJobsites] = useState<Jobsite[]>([]);
  // const [searchString, setSearchString] = useState<string>('');

  useEffect(() => {
    const client = new APIClient();
    const timeRecordAPI = new TimeRecordAPI(client);

    const fetchTimeRecords = async () => {
      try {
        const timeRecordsData: TimeRecord[] =
          await timeRecordAPI.getAllTimeRecords();

        console.log(timeRecordsData);
        setTimeRecords(timeRecordsData);
      } catch (error) {
        console.error('Error fetching time records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeRecords();

    return () => {};
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Text style={{fontSize: 24, marginBottom: 16}}>Time Records</Text>
      <FlatList
        data={timeRecords}
        renderItem={({item}) => <TimeRecordItem timeRecord={item} />}
        keyExtractor={item => item._id}
      />
    </>
  );
};

export default TimeRecordList;
