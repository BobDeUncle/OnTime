/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, FlatList, Modal, StyleSheet, TextInput, TouchableHighlight, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MyText from '../../components/MyText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { storageEmitter } from '../storageEmitter';

import {useTheme} from '../../theme/Colors';
import APIClient from '../../api/APIClient';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import TimeRecord from '../../models/TimeRecord';
import TimeRecordItem from './time-record';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const TimeRecordList: React.FC = () => {
  const {colors} = useTheme();

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [selectedJobsite, setSelectedJobsite] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);
  const jobsiteAPI = new JobsiteAPI(client);

  const getJobsites = async () => {
    setLoading(true);
    try {
      const jobsitesData = await jobsiteAPI.getAllJobsites();
      setJobsites(jobsitesData);
    } catch (error) {
      console.error('Error fetching jobsites:', error);
    } finally {
      setLoading(false);
    }
  };

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
    // Fetch data when the component mounts
    getJobsites();
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
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 22
    },
    row: {
      flexDirection: 'row',
    },
    searchBar: {
      flexDirection: 'row',
      flex: 0.85,
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
    modalView: {
      width: '100%',
      backgroundColor: "white",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

  return (
    <View>
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
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
          </TouchableHighlight>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <MyText style={styles.modalText}>Filter Timesheets</MyText>

            <MyText>Jobsite</MyText>
            <RNPickerSelect
              onValueChange={(value) => setSelectedJobsite(value)}
              items={jobsites.map(jobsite => ({ label: jobsite.name, value: jobsite._id }))}
            />

            <MyText>Status</MyText>
            <RNPickerSelect
              onValueChange={(value) => setSelectedStatus(value)}
              items={[
                { label: 'Approved', value: 'approved' },
                { label: 'Pending', value: 'pending' },
                { label: 'Denied', value: 'denied' },
                // Add more status options as needed
              ]}
            />

            <MyText>Date</MyText>
            <RNPickerSelect
              onValueChange={(value) => setSelectedDate(value)}
              items={[
                { label: 'Today', value: new Date().toISOString() },
                // Add more date options as needed
              ]}
            />

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <MyText style={styles.textStyle}>Hide Modal</MyText>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

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
    </View>
  );
};

export default TimeRecordList;
