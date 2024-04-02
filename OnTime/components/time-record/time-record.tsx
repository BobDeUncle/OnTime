import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import TimeRecord from '../../models/TimeRecord';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import APIClient from '../../api/APIClient';

interface TimeRecordProps {
  timeRecord: TimeRecord;
}

const TimeRecordItem: React.FC<TimeRecordProps> = ({timeRecord}) => {
  const client = new APIClient();
  const timeRecordAPI = new TimeRecordAPI(client);

  const handleDelete = async () => {
    try {
      await timeRecordAPI.deleteTimeRecord(timeRecord._id);
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
      <Text style={styles.text}> Email: {timeRecord.employee.email}</Text>
      <Text style={styles.text}>
        Start Date: {timeRecord.startDate.toString()}
      </Text>
      <Text style={styles.text}>End Date: {timeRecord.endDate.toString()}</Text>
      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
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
