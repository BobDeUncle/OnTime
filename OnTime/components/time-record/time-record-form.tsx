import React, {useState, useCallback} from 'react';
import { Alert, View, StyleSheet, TextInput, Button } from 'react-native';
import MyText from '../../components/MyText';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {useTheme} from '../../theme/Colors';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import APIClient from '../../api/APIClient';

interface TimesheetRecordFormProps {
  styles: any;
}

const TimeRecordForm: React.FC<TimesheetRecordFormProps> = ({ styles }) => {  
  const {colors} = useTheme();
  const user = 'user';

  const [loading, setLoading] = useState<boolean>(true);
  const [jobsite, setJobsite] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setHours(7);
    now.setMinutes(0);
    return now;
  });  
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    now.setHours(15);
    now.setMinutes(0);
    return now;
  });  
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    const client = new APIClient();
    const timeRecordAPI = new TimeRecordAPI(client);

    setLoading(true);

    try {
      await timeRecordAPI.addTimeRecord({
        employee: '660e6d7413463bb6826432f1',
        // date: date,
        startTime: startTime.toISOString(), 
        endTime: endTime.toISOString(),
        jobsite: {
          _id: '66063a1864983a0fb7bb32db',
          name: 'Project Y',
          city: 'Coffs Harbour',
        },
        isApproved: false,
      });

      // refreshList();
    } catch (error) {
      console.error('Error creating time record:', error);
      Alert.alert(
        'Error',
        'Failed to create time record. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  const localStyles = StyleSheet.create({
    timesheetView: {},
    placeholderText: {
      color: colors.border,
      fontSize: 16,
    },
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
    },
    dropdownIcon: {
      top: 8,
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
    },
  });

  return (
    <View style={styles.section}>
      <MyText style={styles.sectionTitle}>New Timesheet</MyText>
      <RNPickerSelect
        onValueChange={value => setJobsite(value)}
        items={[
          {label: 'Jobsite 1', value: 'jobsite1'},
          {label: 'Jobsite 2', value: 'jobsite2'},
        ]}
        placeholder={{label: 'Select Jobsite', value: null}}
        Icon={() => {
          return <FontAwesomeIcon icon='chevron-down' size={24} color={colors.border} />;
        }}
        style={{
          inputIOS: localStyles.dropdownInputIOS,
          inputAndroid: localStyles.dropdownInputAndroid,
          iconContainer: localStyles.dropdownIcon,
          placeholder: localStyles.placeholderText,
        }}
      />
      <View style={localStyles.dateTimeInput}>
        <MyText style={localStyles.text}>Date: </MyText>
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || new Date(date);
            setDate(currentDate.toISOString().split('T')[0]);
          }}
        />
      </View>
      <View style={localStyles.dateTimeInput}>
        <MyText style={localStyles.text}>Start Time: </MyText>
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            const currentTime = selectedTime || startTime;
            setStartTime(currentTime);
          }}
        />
      </View>
      <View style={localStyles.dateTimeInput}>
        <MyText style={localStyles.text}>End Time: </MyText>
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            const currentTime = selectedTime || endTime;
            setEndTime(currentTime);
          }}
        />
      </View>
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
