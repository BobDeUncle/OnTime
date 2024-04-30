import React, { useState, useRef } from 'react';
import { View, Button, Platform, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MyText from '../components/MyText';
import { useTheme } from '../theme/Colors';

interface MyTimePickerProps {
  time: Date;
  onChange: (time: Date) => void;
}

const MyTimePicker: React.FC<MyTimePickerProps> = ({ time, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;
  const { colors } = useTheme();

  const handleChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    onChange(currentTime);
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

  const formatTime = (time: Date) => {
    return new Intl.DateTimeFormat('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }).format(time);
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
    },
    timeInput: {
      padding: 10,
      backgroundColor: colors.background,
      borderRadius: 5,
    },
    timeText: {
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
      <TouchableOpacity style={styles.timeInput} onPress={openPicker}>
        <MyText style={styles.timeText}>{formatTime(time)}</MyText>
      </TouchableOpacity>
      {showPicker && (
        Platform.OS === 'ios' ? (
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
                value={time}
                mode="time"
                display="spinner"
                onChange={handleChange}
              />
              <Button title="Done" onPress={closePicker} color={colors.text} />
            </Animated.View>
          </Animated.View>
        </Modal>
        ) : (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleChange}
            textColor={colors.opText}
          />
        )
      )}
    </View>
  );
};

export default MyTimePicker;
