import React, {useState, useEffect} from 'react';
import { Alert, View, Pressable, StyleSheet, TextInput, Button } from 'react-native';
import MyText from '../../components/MyText';
import MyDatePicker from '../../components/MyDatePicker';
import MyTimePicker from '../../components/MyTimePicker';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { storageEmitter } from '../storageEmitter';

import {useTheme} from '../../theme/Colors';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';
import { useAPIClient } from '../../api/APIClientContext';
import { RecordType } from '../../models/TimeRecord';
import { formatCamelCase } from '../../utils/stringUtils';

interface TimesheetRecordFormProps {
  styles: any;
  showCloseButton: boolean,
  onClose?: () => void;
  onRecordAdded?: () => void;
}

const TimeRecordForm: React.FC<TimesheetRecordFormProps> = ({ styles, showCloseButton, onClose, onRecordAdded }) => {  
  const {colors} = useTheme();
  const { user } = useAPIClient(); 

  const { apiClient } = useAPIClient();

  const timeRecordAPI = new TimeRecordAPI(apiClient);
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(true);
  const [jobsite, setJobsite] = useState(null);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(7);
    now.setMinutes(0);
    now.setSeconds(0);
    return now;
  });  
  const [recordType, setRecordType] = useState<RecordType>(RecordType.hoursWorked);
  const recordTypeItems = Object.values(RecordType).map(type => ({ label: formatCamelCase(type), value: type }));

  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setHours(15);
    now.setMinutes(30);
    now.setSeconds(0);
    return now;
  });  
  const [breakTime, setBreakTime] = useState('');
  const [notes, setNotes] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [jobsiteValid, setJobsiteValid] = useState(true);
  const [endTimeValid, setEndTimeValid] = useState(true); 

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

  const resetForm = () => {
    setJobsite(null);
    setDate(new Date());
    setStartTime(() => {
      const now = new Date();
      now.setHours(7);
      now.setMinutes(0);
      now.setSeconds(0);
      return now;
    });
    setEndTime(() => {
      const now = new Date();
      now.setHours(15);
      now.setMinutes(30);
      now.setSeconds(0);
      return now;
    });
    setBreakTime('');
    setNotes('');
    setRecordType(RecordType.hoursWorked);
    setFormSubmitted(false);
    setJobsiteValid(true);
    setEndTimeValid(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormSubmitted(true);
    const selectedJobsite = jobsites.find(js => js._id === jobsite);

    // Validate inputs
    const isJobsiteValid = jobsite !== null && jobsite !== 'null';
    const isEndTimeValid = !!endTime && endTime > startTime;

    // Update validation status
    setJobsiteValid(isJobsiteValid);
    setEndTimeValid(isEndTimeValid);

    // If any input is invalid, return early
    if (!isJobsiteValid || !isEndTimeValid) {
      return;
    }

    const totalHours = ((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)) - (Number(breakTime) / 60);

    // Format date and time as ISO string with local time zone offset
    const formatLocalDateTime = (date: Date) => {
      const tzOffset = -date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(date.getTime() + tzOffset).toISOString().slice(0, -1);
      const offsetSign = date.getTimezoneOffset() > 0 ? '-' : '+';
      const offsetHours = String(Math.abs(date.getTimezoneOffset() / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(date.getTimezoneOffset() % 60)).padStart(2, '0');
      return `${localISOTime}${offsetSign}${offsetHours}:${offsetMinutes}`;
    };

    const startTimeFormatted = formatLocalDateTime(startTime);
    const endTimeFormatted = formatLocalDateTime(endTime);

    // Show a confirmation popup
    Alert.alert(
      'Submit Time Record',
      `You worked at ${selectedJobsite?.name ?? 'ERROR'} for ${totalHours.toFixed(2)} hours. Do you wish to submit this record? `, // Message
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              await timeRecordAPI.addTimeRecord({
                employee: user?._id,
                date: date,
                startTime: startTimeFormatted, 
                endTime: endTimeFormatted,
                breakHours: Number(breakTime) / 60,
                jobsite: selectedJobsite,
                recordType: recordType,
                isApproved: false,
                notes: notes,
              });

              console.log({
                employee: user?._id,
                date: date,
                startTime: startTimeFormatted, 
                endTime: endTimeFormatted,
                breakHours: Number(breakTime) / 60,
                jobsite: selectedJobsite,
                recordType: recordType,
                isApproved: false,
                notes: notes,
              });

              Alert.alert(
                'Success',
                'Your timesheet was successfully submitted.',
                [{ text: 'OK' }]
              );
        
              resetForm();
              saveTimeRecord();
              if (onClose) onClose();
              if (onRecordAdded) onRecordAdded();
            } catch (error) {
              console.error('Error creating time record:', error);
              Alert.alert(
                'Error',
                'Failed to create time record. Please try again later.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const saveTimeRecord = async () => {
    storageEmitter.emit('timeRecordsUpdated');
  };

  useEffect(() => {
    getJobsites();
  }, []);

  const localStyles = StyleSheet.create({
    timesheetView: {},
    invalidForm: {
      color: colors.warning,
      paddingBottom: 10,
    },
    invalidFormIcon: {
      color: colors.warning,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: { 
      padding: 10,
      paddingTop: 0,
      paddingRight: 0,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.text,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownIcon: {
      top: 6,
      right: 10,
    },
    dateTimeInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
    },
    text: {
      color: colors.border,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>New Time Record</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text}/>
          </Pressable>
        )}
      </View>
      {!jobsiteValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Please pick a jobsite
        </MyText>
      )}

      {!endTimeValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> End Time must be after the Start Time
        </MyText>
      )}
      <RNPickerSelect
        onValueChange={value => {
          setJobsite(value);
          if (formSubmitted) {
            setJobsiteValid(!!value);
          }
        }}
        items={jobsites.map(jobsite => ({ label: jobsite.name, value: jobsite._id }))}
        placeholder={{label: 'Select Jobsite', value: null}}
        Icon={() => {
          return <FontAwesomeIcon icon='chevron-down' size={24} color={jobsiteValid ? colors.border : colors.warning} />;
        }}
        style={{
          inputIOS: {
            ...localStyles.dropdownInputIOS,
            borderColor: jobsiteValid ? colors.border : colors.warning,
            marginBottom: 10,
          },
          inputAndroid: {
            ...localStyles.dropdownInputAndroid,
            borderColor: jobsiteValid ? colors.border : colors.warning,
          },
          iconContainer: localStyles.dropdownIcon,
          placeholder: {
            ...localStyles.placeholderText,
            color: jobsiteValid ? colors.border : colors.warning,
          },
        }}
      />
        <RNPickerSelect
          onValueChange={value => setRecordType(value as RecordType)}
          value={recordType}
          items={recordTypeItems}
          placeholder={{}}
          Icon={() => {
            return <FontAwesomeIcon icon='chevron-down' size={24} color={recordType ? colors.border : colors.warning} />;
          }}
          style={{
            inputIOS: {
              ...localStyles.dropdownInputIOS,
              borderColor: recordType ? colors.border : colors.warning,
            },
            inputAndroid: {
              ...localStyles.dropdownInputAndroid,
              borderColor: recordType ? colors.border : colors.warning,
            },
            iconContainer: localStyles.dropdownIcon,
          }}
      />
      <MyDatePicker
        date={date}
        onChange={(newDate: Date) => setDate(newDate)}
      />
      <MyTimePicker
        time={startTime}
        onChange={(newStartTime: Date) => setStartTime(newStartTime)}
      />
      <MyTimePicker
        time={endTime}
        onChange={(newEndTime: Date) => setEndTime(newEndTime)}
      />
      <TextInput
        value={breakTime}
        onChangeText={setBreakTime}
        keyboardType="numeric"
        placeholder="Break Time (mins)"
        placeholderTextColor={localStyles.placeholderText.color}
        style={localStyles.textInput}
        returnKeyType="done"
      />
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        placeholderTextColor={localStyles.placeholderText.color}
        style={localStyles.textInput}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default TimeRecordForm;
