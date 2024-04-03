import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';

interface MyTextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const MyText: React.FC<MyTextProps> = ({children, style}) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default MyText;
