import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import MyText from '../MyText';
import MyDatePicker from '../MyDatePicker';
import MyTimePicker from '../MyTimePicker';
import RNPickerSelect from 'react-native-picker-select';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {useTheme} from '../../theme/Colors';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import JobsiteAPI from '../../api/JobsiteAPI';
import Jobsite from '../../models/Jobsite';
import {useAPIClient} from '../../api/APIClientContext';
import TimeRecord from '../../models/TimeRecord';

interface TimesheetRecordUpdateFormProps {
  styles?: any;
  timeRecord: TimeRecord;
  onUpdate: (_timeRecord: TimeRecord) => Promise<any>
}

const TimeRecordUpdateForm: React.FC<TimesheetRecordUpdateFormProps> = ({
  timeRecord,
  onUpdate
}) => {
  const {colors} = useTheme();
  const {apiClient} = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [jobsiteValid, setJobsiteValid] = useState(true);
  const [endTimeValid, setEndTimeValid] = useState(true);
  const [newTimeRecord, setNewTimeRecord] = useState(timeRecord);
  const [errorMessage, setErrorMessage] = useState('');

  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [selectedJobsiteId, setSelectedJobsiteId] = useState(timeRecord.jobsite?._id || '');

  useEffect(() => {
    getJobsites();
  }, []);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setFormSubmitted(true);

      const isEndTimeValid =
        !!newTimeRecord.endTime &&
        newTimeRecord.endTime > newTimeRecord.startTime;
  
      // If any input is invalid, return early
      if (!isEndTimeValid) {
        setErrorMessage('End time cannot be before start time')
      }

      const result = await onUpdate(newTimeRecord);
      Alert.alert("Timesheet item updated", 'Successfully updated timesheet item')
    } finally {
      setLoading(false);
    }
  };

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
      justifyContent: 'space-between',
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
    section: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
      width: '80%',
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 10,
    },
    button: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      borderColor: 'black',
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={localStyles.section}>
      {!jobsiteValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon
            icon="exclamation"
            style={localStyles.invalidFormIcon}
          />{' '}
          Please pick a jobsite
        </MyText>
      )}
      {!endTimeValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon
            icon="exclamation"
            style={localStyles.invalidFormIcon}
          />{' '}
          End Time must be after the Start Time
        </MyText>
      )}
      <RNPickerSelect
        onValueChange={(item) => {
          setSelectedJobsiteId(item);
          setNewTimeRecord({
            ...newTimeRecord,
            jobsite: {...newTimeRecord.jobsite, _id: item},
          });

          if (formSubmitted) {
            setJobsiteValid(!!item);
          }
        }}
        value={selectedJobsiteId}
        items={jobsites.map((jobsite: Jobsite) => ({
          label: jobsite.name,
          value: jobsite._id,
        }))}
        Icon={() => {
          return (
            <FontAwesomeIcon
              icon="chevron-down"
              size={24}
              color={jobsiteValid ? colors.border : colors.warning}
            />
          );
        }}
        style={{
          inputIOS: {
            ...localStyles.dropdownInputIOS,
            borderColor: jobsiteValid ? colors.border : colors.warning,
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
      <MyDatePicker
        date={new Date(newTimeRecord.date)}
        onChange={(newDate: Date) =>
          setNewTimeRecord({...newTimeRecord, date: newDate})
        }
      />
      <MyTimePicker
        time={new Date(newTimeRecord.startTime)}
        onChange={(newStartTime: Date) =>
          setNewTimeRecord({...newTimeRecord, startTime: newStartTime})
        }
      />
      <MyTimePicker
        time={new Date(newTimeRecord.endTime)}
        onChange={(newEndTime: Date) =>
          setNewTimeRecord({...newTimeRecord, endTime: newEndTime})
        }
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

export default TimeRecordUpdateForm;