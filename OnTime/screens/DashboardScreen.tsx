import React, {useState} from 'react';
import {Button, Platform, StyleSheet, TextInput, View} from 'react-native';
import MyText from '../components/MyText';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {useTheme} from '../theme/Colors';

function DashboardScreen({}): React.ReactElement {
  const {colors} = useTheme();
  const user = 'user';

  const [jobsite, setJobsite] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    console.log('handleSubmit at: ', jobsite);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    welcome: {
      color: colors.opText,
      fontSize: 24,
      marginVertical: 16,
      fontWeight: 'bold',
    },
    section: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 10,
    },
    timesheetView: {},
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
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
      right: 13,
    },
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <MyText style={styles.welcome}>Welcome, {user}</MyText>
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
            inputIOS: styles.dropdownInputIOS,
            inputAndroid: styles.dropdownInputAndroid,
            iconContainer: styles.dropdownIcon,
          }}
        />
        <View style={{...styles.textInput, flexDirection: 'row', alignItems: 'center'}}>
          <MyText>Date: </MyText>
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
        <TextInput
          value={startTime}
          onChangeText={setStartTime}
          placeholder="Start Time"
          style={styles.textInput}
        />
        <TextInput
          value={endTime}
          onChangeText={setEndTime}
          placeholder="End Time"
          style={styles.textInput}
        />
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          style={styles.textInput}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}>Monthly Activity</MyText>
        {/* Add your status indicators here */}
      </View>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}>Recent History</MyText>
        {/* Add your history entries here */}
      </View>
    </View>
  );
}

export default DashboardScreen;
