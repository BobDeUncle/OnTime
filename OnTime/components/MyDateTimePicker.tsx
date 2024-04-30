import React, { useState } from 'react';
import { View, Button, Platform, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface MyDateTimePickerProps {
  label: string;
  date: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

const MyDateTimePicker: React.FC<MyDateTimePickerProps> = ({ label, date, mode, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Keep picker open on iOS after selection
    onChange(currentDate);
  };

  // Function to format date and time
  const formatDate = (date: Date, mode: 'date' | 'time') => {
    if (mode === 'date') {
      return new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-AU', { hour: '2-digit', minute: '2-digit' }).format(date);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formatDate(date, mode)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalView}>
            <DateTimePicker
              value={date}
              mode={mode}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleChange}
            />
            <Button title="Done" onPress={() => setShowPicker(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 15,
  },
  dateInput: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
});

export default MyDateTimePicker;
