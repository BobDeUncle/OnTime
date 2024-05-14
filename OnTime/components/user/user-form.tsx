// TO DO:
// roles?
// add create users

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import MyText from '../../components/MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import UserAPI from '../../api/UserAPI';
import { useAPIClient } from '../../api/APIClientContext';

interface UserFormProps {
  styles: any;
  showCloseButton: boolean,
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ styles, showCloseButton, onClose }) => {  
  const {colors} = useTheme();
  const { user } = useAPIClient(); 

  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setFormSubmitted(true);

    // Validate inputs
    const isFirstNameValid = firstName.trim().length > 0;
    const isLastNameValid = lastName.trim().length > 0;
    const isEmailValid = validateEmail(email);

    // Update validation status
    setFirstNameValid(isFirstNameValid);
    setLastNameValid(isLastNameValid);
    setEmailValid(isEmailValid);

    // If any input is invalid, return early
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid) {
      return;
    }

    // Show a confirmation popup
    Alert.alert(
      'Submit New User',
      `Do you wish to create a new user ${firstName} ${lastName} with email as ${email} and role of ${role}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              await userAPI.createUser({
                firstName,
                lastName,
                email,
                role,
              });

              console.log({
                firstName,
                lastName,
                email,
                role,
              });
        
              saveUser();
              if (onClose) onClose();
            } catch (error) {
              console.error('Error creating user:', error);
              Alert.alert(
                'Error',
                'Failed to create user. Please try again later.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const saveUser = async () => {
    storageEmitter.emit('usersUpdated');
  };

  const localStyles = StyleSheet.create({
    timesheetView: {},
    invalidForm: {
      color: colors.warning,
      paddingBottom: 10,
    },
    invalidFormIcon: {
      color: colors.warning,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: { 
      padding: 10,
      paddingTop: 0,
      paddingRight: 0,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.text,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownIcon: {
      top: 6,
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
      fontSize: 14,
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>New User</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text}/>
          </Pressable>
        )}
      </View>
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: firstNameValid ? colors.border : colors.warning,
        }}
        placeholder="First Name"
        placeholderTextColor={localStyles.placeholderText.color}
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setFirstNameValid(text.trim().length > 0);
        }}
      />
      {!firstNameValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid First Name
        </MyText>
      )}
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: lastNameValid ? colors.border : colors.warning,
        }}
        placeholder="Last Name"
        placeholderTextColor={localStyles.placeholderText.color}
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          setLastNameValid(text.trim().length > 0);
        }}
      />
      {!lastNameValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Last Name
        </MyText>
      )}
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: emailValid ? colors.border : colors.warning,
        }}
        placeholder="Email"
        placeholderTextColor={localStyles.placeholderText.color}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailValid(validateEmail(text));
        }}
      />
      {!emailValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Email
        </MyText>
      )}
      <TextInput
        style={localStyles.textInput}
        placeholder="Role"
        placeholderTextColor={localStyles.placeholderText.color}
        value={role}
        onChangeText={setRole}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default UserForm;
