import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Animated, FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MyText from '../../components/MyText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {useTheme} from '../../theme/Colors';
import APIClient from '../../api/APIClient';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';

type TimeRecordFilterProps = {
  onApply: (selectedJobsite: string, selectedStatus: string, selectedDate: string, selectedSortOrder: string) => void;
};

const TimeRecordFilter: React.FC<TimeRecordFilterProps> = ({ onApply }) => {
  const {colors} = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [selectedJobsite, setSelectedJobsite] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSortOrder, setSelectedSortOrder] = useState('asc');
  const [modalBackdropOpacity, setModalBackdropOpacity] = useState(new Animated.Value(0));

  const client = new APIClient();
  const jobsiteAPI = new JobsiteAPI(client);

  useEffect(() => {
    getJobsites();
  }, []);

  useEffect(() => {
    Animated.timing(modalBackdropOpacity, {
      toValue: modalVisible ? 0.5 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const getJobsites = async () => {
    try {
      const jobsitesData = await jobsiteAPI.getAllJobsites();
      setJobsites(jobsitesData);
    } catch (error) {
      console.error('Error fetching jobsites:', error);
    }
  };

  const applyFiltering = () => {
    onApply(selectedJobsite, selectedStatus, selectedDate, selectedSortOrder);
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 22
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '100%',
      backgroundColor: colors.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 35,
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      paddingHorizontal: 30,
    },
    modalSectionTitleView: {
      textAlign: 'left',
      paddingHorizontal: 0,
      paddingBottom: 10,
      alignSelf: 'stretch',
    },
    modalSectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalButtons: {
      color: colors.warning,
    },
    dropdownInputIOS: {
      color: colors.opText,
      borderColor: colors.border,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.opText,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownIcon: {
      color: colors.border,
      top: 6,
      right: 10,
    },
    applyButtonContainer: {
      alignSelf: 'stretch',
      alignItems: 'flex-end',
    },
    applyButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
    },
    applyButtonText: {
      color: colors.text,
    },
  });

  return (
    <View>
      <View>
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
        </Pressable>
      </View>
      <Animated.View 
        style={{ ...styles.modalBackdrop, opacity: modalBackdropOpacity }} 
        pointerEvents={modalVisible ? 'auto' : 'none'}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                underlayColor='transparent'
              >
                <MyText style={styles.modalButtons}>Cancel</MyText>
              </TouchableHighlight>
              <MyText style={styles.modalTitle}>Filter Timesheets</MyText>
              <TouchableHighlight
                onPress={() => {
                  setSelectedJobsite('');
                  setSelectedStatus('');
                  setSelectedDate('');
                  setSelectedSortOrder('asc');
                }}
                underlayColor='transparent'
              >
                <MyText style={styles.modalButtons}>Reset</MyText>
              </TouchableHighlight>
            </View>

            <View style={styles.modalSectionTitleView}>
              <MyText style={styles.modalSectionTitle}>Sort By</MyText>
            </View>

            <RNPickerSelect
              value={selectedJobsite}
              onValueChange={(value) => setSelectedJobsite(value)}
              items={jobsites.map(jobsite => ({ label: jobsite.name, value: jobsite._id }))}
              placeholder={{label: 'Select Jobsite', value: null}}
              Icon={() => {
                return <FontAwesomeIcon icon='chevron-down' size={24} color={colors.border} />;
              }}
              style={{
                inputIOS: styles.dropdownInputIOS,
                inputAndroid: styles.dropdownInputAndroid,
                iconContainer: styles.dropdownIcon,
                placeholder: styles.placeholderText,
              }}
            />

            <RNPickerSelect
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
              items={[
                { label: 'Approved', value: 'approved' },
                { label: 'Pending', value: 'pending' },
                { label: 'Denied', value: 'denied' },
                // Add more status options as needed
              ]}
              placeholder={{label: 'Select Status', value: null}}
              Icon={() => {
                return <FontAwesomeIcon icon='chevron-down' size={24} color={colors.border} />;
              }}
              style={{
                inputIOS: styles.dropdownInputIOS,
                inputAndroid: styles.dropdownInputAndroid,
                iconContainer: styles.dropdownIcon,
                placeholder: styles.placeholderText,
              }}
            />

            <RNPickerSelect
              value={selectedDate}
              onValueChange={(value) => setSelectedDate(value)}
              items={[
                { label: 'Today', value: new Date().toISOString() },
                // Add more date options as needed
              ]}
              placeholder={{label: 'Select Date', value: null}}
              Icon={() => {
                return <FontAwesomeIcon icon='chevron-down' size={24} color={colors.border} />;
              }}
              style={{
                inputIOS: styles.dropdownInputIOS,
                inputAndroid: styles.dropdownInputAndroid,
                iconContainer: styles.dropdownIcon,
                placeholder: styles.placeholderText,
              }}
            />

            <View style={styles.modalSectionTitleView}>
              <MyText style={styles.modalSectionTitle}>Order</MyText>
            </View>

            <RNPickerSelect
              value={selectedSortOrder}
              placeholder={{}}
              onValueChange={(value) => setSelectedSortOrder(value)}
              items={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
              Icon={() => {
                return <FontAwesomeIcon icon='chevron-down' size={24} color={colors.border} />;
              }}
              style={{
                inputIOS: styles.dropdownInputIOS,
                inputAndroid: styles.dropdownInputAndroid,
                iconContainer: styles.dropdownIcon,
              }}
            />

            <View style={styles.applyButtonContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  applyFiltering();
                }}
              >
                <MyText style={styles.applyButtonText}>Apply</MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimeRecordFilter;
