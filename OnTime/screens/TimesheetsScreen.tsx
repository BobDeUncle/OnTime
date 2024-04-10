import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, FlatList, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { storageEmitter } from '../components/storageEmitter';

import NewTimeRecordButton from '../components/time-record/time-record-modal-button';

import {useTheme} from '../theme/Colors';
import APIClient from '../api/APIClient';
import TimeRecordAPI from '../api/TimeRecordAPI';
import TimeRecord from '../models/TimeRecord';
import TimeRecordItem from '../components/time-record/time-record';
import TimeRecordFilter from '../components/time-record/time-record-filter';

const TimesheetsScreen: React.FC = () => {
  const {colors} = useTheme();

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchTimeRecords();

    // Listen for the 'timeRecordsUpdated' event
    storageEmitter.on('timeRecordsUpdated', refreshList);

    // Cleanup function
    return () => {
      // Remove the event listener when the component unmounts
      storageEmitter.off('timeRecordsUpdated', refreshList);
    };
  }, []);

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

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const handleApplyFilter = (selectedJobsite: string, selectedStatus: string, selectedDate: string, selectedSortOrder: string) => {
    // Update the `timeRecords` state variable based on the selected filter values.
    console.log('apply filtering');
  };

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    searchBar: {
      flexDirection: 'row',
      flex: 0.7,
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      margin: 10,
      padding: 10,
    },
    searchInput: {
      flex: 1,
      color: colors.opText,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    filterView: {
      flex: 0.15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 5,
    },
  });

  return (
    <ScrollView style={{backgroundColor: colors.background}}>
      <View style={styles.row}>
        <View style={styles.searchBar}>
          <TextInput
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
            placeholder="Search"
            placeholderTextColor={styles.placeholderText.color}
            style={styles.searchInput}
          />
          <FontAwesomeIcon icon='search' size={20} color={colors.border} />
        </View>
        <View style={styles.filterView}>
          <NewTimeRecordButton />
        </View>
        <View style={styles.filterView}>
          <TimeRecordFilter onApply={handleApplyFilter} />
        </View>
      </View>

      <FlatList
        scrollEnabled={false}
        data={timeRecords}
        renderItem={({item}) => (
          <TimeRecordItem
            timeRecord={item}
            refreshList={refreshList}
          />
        )}
        keyExtractor={item => item._id}
      />
    </ScrollView>
  );
};

export default TimesheetsScreen;
