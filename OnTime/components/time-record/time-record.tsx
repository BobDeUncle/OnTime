import React from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import MyText from '../../components/MyText';
import TimeRecord from '../../models/TimeRecord';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import APIClient from '../../api/APIClient';

interface TimeRecordProps {
  timeRecord: TimeRecord;
  fetchTimeRecords: () => Promise<void>;
}

const TimeRecordItem: React.FC<TimeRecordProps> = ({
  timeRecord,
  fetchTimeRecords,
}) => {
  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);

  const handleDelete = async () => {
    try {
      await timeRecordAPI.deleteTimeRecord(timeRecord._id);
      // Alert.alert('Success!');

      fetchTimeRecords(); // refresh list on success
    } catch (error) {
      console.error('Error deleting time record:', error);
      Alert.alert(
        'Error',
        'Failed to delete time record. Please try again later.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <MyText style={styles.text}> Email: {timeRecord.employee.email}</MyText>
      <MyText style={styles.text}>
        Date: {timeRecord.date.toString()}
      </MyText>
      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <MyText style={styles.buttonText}>Delete</MyText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimeRecordItem;
