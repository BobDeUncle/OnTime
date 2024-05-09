import React from 'react';
import { Text, StyleSheet, TextStyle, GestureResponderEvent } from 'react-native';

interface MyTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  onPress?: (event: GestureResponderEvent) => void;
}

const MyText: React.FC<MyTextProps> = ({ children, style, onPress }) => {
  return (
    <Text style={[styles.text, style]} onPress={onPress}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default MyText;
