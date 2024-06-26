import React, {useState, useEffect, useCallback} from 'react';
import { Animated, Modal, Pressable, StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyText from '../../components/MyText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {useTheme} from '../../theme/Colors';
import { useAPIClient } from '../../api/APIClientContext';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';
import UserAPI from '../../api/UserAPI';
import User from '../../models/User'; 
import { RecordType } from '../../models/TimeRecord';
import { formatCamelCase } from '../../utils/stringUtils';

type TimeRecordFilterProps = {
  onApply: (selectedJobsite: string, selectedEmployee: string, selectedStatus: string, selectedStartDate: string, selectedEndDate: string, selectedSortOrder: string, selectedRecordType: string) => void;
  onModalVisibleChange: (visible: boolean) => void;
};

const TimeRecordFilter: React.FC<TimeRecordFilterProps> = ({ onApply, onModalVisibleChange }) => {
  const {colors} = useTheme();
  const { user } = useAPIClient(); 

  const isManager = user ? user.roles.some(role => role.name === 'admin' || role.name === 'supervisor') : false;
  const recordTypeItems = Object.values(RecordType).map(type => ({ label: formatCamelCase(type), value: type }));


  const [modalVisible, setModalVisible] = useState(false);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedJobsite, setSelectedJobsite] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRecordType, setSelectedRecordType] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedSortOrder, setSelectedSortOrder] = useState('asc');
  const [modalBackdropOpacity, setModalBackdropOpacity] = useState(new Animated.Value(0));

  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);
  const userAPI = new UserAPI(apiClient);

  useEffect(() => {
    getJobsites();
    getEmployees();
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

  const getEmployees = async () => {
    try {
      const employeesData = await userAPI.getAllUsers();
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFiltering = () => {
    setModalVisible(false);
    onModalVisibleChange(false);

    const selectedStartDateTemp = showStartPicker ? selectedStartDate : '';
    const selectedEndDateTemp = showEndPicker ? selectedEndDate : '';

    const selectedJobsiteTemp = selectedJobsite ?? '';
    const selectedEmployeeTemp = selectedEmployee ?? '';
    const selectedStatusTemp = selectedStatus ?? '';

    onApply(selectedJobsiteTemp, selectedEmployeeTemp, selectedStatusTemp, selectedStartDateTemp, selectedEndDateTemp, selectedSortOrder, selectedRecordType);
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
    dateTimeInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      paddingTop: 10,      
      paddingBottom: 10,
      paddingRight: 0,
      paddingLeft: 10,
      marginBottom: 10,
      color: colors.text,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%',
    },
    text: {
      color: colors.border,
      fontSize: 14,
    },
    calIcon: {
      color: colors.border,
      marginRight: 8,
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
            onModalVisibleChange(true);
          }}
        >
          <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          onModalVisibleChange(false);
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableHighlight
                onPress={() => {
                  onModalVisibleChange(false);
                  setModalVisible(false);
                }}
                underlayColor='transparent'
              >
                <MyText style={styles.modalButtons}>Cancel</MyText>
              </TouchableHighlight>
              <MyText style={styles.modalTitle}>Filter Timesheets</MyText>
              <TouchableHighlight
                onPress={() => {
                  setSelectedJobsite('');
                  setSelectedEmployee('');
                  setSelectedStatus('');
                  setSelectedRecordType('');
                  setSelectedStartDate(new Date().toISOString().split('T')[0]);
                  setSelectedEndDate(new Date().toISOString().split('T')[0]);
                  setShowStartPicker(false);
                  setShowEndPicker(false);
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

            {isManager && (
              <RNPickerSelect
                value={selectedEmployee}
                onValueChange={(value) => setSelectedEmployee(value)}
                items={employees.map(employee => ({ label: employee.firstName + ' ' + employee.lastName, value: employee._id }))}
                placeholder={{label: 'Select Employee', value: null}}
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
            )}

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
              value={selectedRecordType}
              onValueChange={(value) => setSelectedRecordType(value)}
              items={recordTypeItems}
              placeholder={{label: 'Select Type', value: null}}
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
            <View style={styles.dateTimeInput}>
              <MyText style={styles.text}>Start Date: </MyText>
              {!showStartPicker && (
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <FontAwesomeIcon icon="calendar" size={24} style={styles.calIcon} />
                </TouchableOpacity>
              )}
              {showStartPicker && (
                <DateTimePicker
                  value={new Date(selectedStartDate) || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => setSelectedStartDate(selectedDate ? selectedDate.toISOString().split('T')[0] : '')}
                />
              )}
            </View>

            <View style={styles.dateTimeInput}>
              <MyText style={styles.text}>End Date: </MyText>
              {!showEndPicker && (
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <FontAwesomeIcon icon="calendar" size={24} style={styles.calIcon} />
                </TouchableOpacity>
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={new Date(selectedEndDate) || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => setSelectedEndDate(selectedDate ? selectedDate.toISOString().split('T')[0] : '')}
                />
              )}
            </View>

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
