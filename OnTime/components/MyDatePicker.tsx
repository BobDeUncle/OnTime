import React, { useState, useRef } from 'react';
import { View, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyText from '../components/MyText';
import { useTheme } from '../theme/Colors';

interface MyDatePickerProps {
  date: Date;
  onChange: (date: Date) => void;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ date, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    onChange(currentDate);
  };

  const openPicker = () => {
    setShowPicker(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const closePicker = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 500, 
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setShowPicker(false);
    });
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
    },
    dateInput: {
      padding: 10,
      backgroundColor: colors.background,
      borderRadius: 5,
    },
    dateText: {
      fontSize: 16,
      color: colors.opText,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderRadius: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingVertical: 20,
      paddingHorizontal: 20,
      transform: [{ translateY: slideAnim }]
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dateInput} onPress={openPicker}>
        <MyText style={styles.dateText}>{new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)}</MyText>
      </TouchableOpacity>
      {showPicker && (
        <Modal
          transparent={true}
          animationType="none"
          visible={showPicker}
          onRequestClose={closePicker}
          presentationStyle="overFullScreen"
        >
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <Animated.View style={styles.modalContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleChange}
              />
              <Button title="Done" onPress={closePicker} color={colors.text} />
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

export default MyDatePicker;
