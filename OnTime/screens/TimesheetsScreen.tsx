import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Animated, FlatList, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { storageEmitter } from '../components/storageEmitter';
import MyText from '../components/MyText';
import { useFocusEffect } from '@react-navigation/native';

import NewTimeRecordButton from '../components/time-record/time-record-modal-button';

import {useTheme} from '../theme/Colors';
import { useAPIClient } from '../api/APIClientContext';
import TimeRecordAPI from '../api/TimeRecordAPI';
import TimeRecord, { RecordType } from '../models/TimeRecord';
import TimeRecordItem from '../components/time-record/time-record';
import TimeRecordFilter from '../components/time-record/time-record-filter';
import TimeRecordExportButton from '../components/time-record/time-record-export-button';

const TimesheetsScreen: React.FC = () => {
  const {colors} = useTheme();
  const { user } = useAPIClient(); 

  const { apiClient } = useAPIClient();

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(new Animated.Value(0.5));
  const [filters, setFilters] = useState({
    jobsites: [] as string[],
    employees: [] as string[],
    status: '',
    startDate: '',
    endDate: '',
    sortOrder: '',
    recordType: ''
  });

  const isAdmin = user && user.roles.some(role => role.name === 'admin');

  const timeRecordAPI = new TimeRecordAPI(apiClient);

  useEffect(() => {
    storageEmitter.on('timeRecordsUpdated', refreshList);

    return () => {
      storageEmitter.off('timeRecordsUpdated', refreshList);
    };
  }, []);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: overlayVisible ? 0.5 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [overlayVisible]);

  useEffect(() => {
    const searchTimerId = setTimeout(() => {
      refreshList();
    }, 500);
  
    return () => {
      clearTimeout(searchTimerId);
    };
  }, [searchQuery]);

  const refreshList = (params?: any) => {
    fetchTimeRecords(params);
  }

  const fetchTimeRecords = useCallback(async (params: {[key: string]: any} = {}) => {
    setLoading(true);
    params.search = searchQuery;
    if (user && !isAdmin) {
      params.employees = user._id;
    }

    try {
      const timeRecordsData: TimeRecord[] =
        await timeRecordAPI.getAllTimeRecords(params);
        
        setTimeRecords(timeRecordsData);
    } catch (error) {
      console.error('Error fetching time records:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRecordAPI]);  

  useFocusEffect(
    useCallback(() => {
      fetchTimeRecords();
    }, [])
  );

  const handleApplyFilter = (selectedJobsite: string, selectedEmployee: string, selectedStatus: string, selectedStartDate: string, selectedEndDate: string, selectedSortOrder: string, selectedRecordType: string) => {
    const params = {
      jobsites: [selectedJobsite],
      employees: [selectedEmployee],
      status: [selectedStatus],
      startDate: [selectedStartDate],
      endDate: [selectedEndDate],
      recordType: [selectedRecordType],
      sortOrder: [selectedSortOrder]
    };

    setFilters({
      jobsites: [selectedJobsite],
      employees: [selectedEmployee],
      status: selectedStatus,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      recordType: selectedRecordType,
      sortOrder: selectedSortOrder
    });
  
    refreshList(params);
  };

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    searchBar: {
      flexDirection: 'row',
      flex: isAdmin ? 0.55 : 0.7,
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
    emptyListText: {
      textAlign: 'center',
      color: colors.opText,
      marginTop: 20,
      fontSize: 16,
      paddingHorizontal: 20,
    },
  });

  return (
    <View style={{flex: 1}}>
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
            <NewTimeRecordButton onModalVisibleChange={setOverlayVisible} />
          </View>
          <View style={styles.filterView}>
            <TimeRecordFilter onApply={handleApplyFilter} onModalVisibleChange={setOverlayVisible} />
          </View>
          {isAdmin && (
            <View style={styles.filterView}>
              <TimeRecordExportButton filters={filters} onModalVisibleChange={setOverlayVisible} />
            </View>
          )}
        </View>

        {loading ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
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
          ListEmptyComponent={<MyText style={styles.emptyListText}>No time records found. Try a different filter or add in a new timesheet.</MyText>}
        />
      )}
      </ScrollView>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'black',
          opacity: overlayOpacity,
        }}
        pointerEvents={overlayVisible ? 'auto' : 'none'}
      />
    </View>
  );
};

export default TimesheetsScreen;
