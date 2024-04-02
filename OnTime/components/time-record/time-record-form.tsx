import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import TimeRecordAPI from '../../api/TimeRecordAPI'; // Import your TimeRecord API client
import APIClient from '../../api/APIClient';

const NewTimeRecordForm: React.FC = () => {
  const fakeUser = {
    employee: '660be79e17307a03e7534100',
    startDate: new Date(),
    endDate: new Date(),
    jobsite: {
      name: 'Project X',
      city: 'Gold Coast',
    },
  };

  // fake types for now - will be typed as employee, dates, jobsite
  const [employee, setEmployee] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [jobsite, setJobsite] = useState<string>();

  const handleCreate = async () => {
    const client = new APIClient();
    const timeRecordAPI = new TimeRecordAPI(client);

    try {
      await timeRecordAPI.addTimeRecord({
        ...fakeUser,
      });
      Alert.alert('Success', 'Time record created successfully');
    } catch (error) {
      console.error('Error creating time record:', error);
      Alert.alert(
        'Error',
        'Failed to create time record. Please try again later.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Employee:</Text>
      <TextInput
        style={styles.input}
        value={employee}
        onChangeText={setEmployee}
        placeholder="Enter employee ID"
      />
      <Text style={styles.label}>Start Date:</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="Enter start date"
      />
      <Text style={styles.label}>End Date:</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
        placeholder="Enter end date"
      />
      <Text style={styles.label}>Jobsite:</Text>
      <TextInput
        style={styles.input}
        value={jobsite}
        onChangeText={setJobsite}
        placeholder="Enter jobsite ID"
      />
      <Button title="Create Time Record" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
});

export default NewTimeRecordForm;
