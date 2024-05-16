import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Switch } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import UserAPI from '../../api/UserAPI';
import Role from '../../models/Role';
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
  const lastNameRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const emailRef = useRef<TextInput>(null);
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [isEmployeeActive, setIsEmployeeActive] = useState(true);
  const [isSupervisorActive, setIsSupervisorActive] = useState(false);

  const roleData = [
    {
      _id: "65f0b68656bb772dc458d60d",
      name: "admin",
    },
    {
      _id: "6607b7c8e0193b972120fa1a",
      name: "employee",
    },
    {
      _id: "6607b7d4e0193b972120fa1c",
      name: "supervisor",
    }
  ];

  const getSelectedRoles = (): Role[] => {
    const selectedRoles: Role[] = [];
    if (isAdminActive) {
      const adminRole = roleData.find(role => role.name === "admin");
      if (adminRole) selectedRoles.push(adminRole);
    }
    if (isEmployeeActive) {
      const employeeRole = roleData.find(role => role.name === "employee");
      if (employeeRole) selectedRoles.push(employeeRole);
    }
    if (isSupervisorActive) {
      const supervisorRole = roleData.find(role => role.name === "supervisor");
      if (supervisorRole) selectedRoles.push(supervisorRole);
    }
    return selectedRoles;
  };
  
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setFormSubmitted(true);

    // Validate inputs
    const isFirstNameValid = firstName.trim().length > 0;
    const isLastNameValid = lastName.trim().length > 0;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.trim().length > 0;

    // Update validation status
    setFirstNameValid(isFirstNameValid);
    setLastNameValid(isLastNameValid);
    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    // If any input is invalid, return early
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    // Show a confirmation popup
    Alert.alert(
      'Submit New User',
      `Do you wish to create a new user ${firstName} ${lastName} with email as ${email}, 
      password as ${password} and role(s) of ${getSelectedRoles().map(role => role.name).join(", ")}?`,
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
                password,
                getSelectedRoles,
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
    container: {
      flex: 1,
      paddingTop: 10
    },
    roleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      paddingVertical: 3,
      paddingLeft: 10,
      paddingRight: 5,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
    },
    roleText: {
      color: colors.border,
      fontSize: 14,
    },
    switch: {
      transform: [{ scaleX: .8 }, { scaleY: .8 }]
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
        returnKeyType="next"
        onSubmitEditing={() => lastNameRef.current?.focus()}
        blurOnSubmit={false}
      />
      {!firstNameValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid First Name
        </MyText>
      )}
      <TextInput
        ref={lastNameRef}
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
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        blurOnSubmit={false}
      />
      {!lastNameValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Last Name
        </MyText>
      )}
      <TextInput
        ref={emailRef}
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
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
      />
      {!emailValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Email
        </MyText>
      )}
      <TextInput
        ref={passwordRef}
        style={{
          ...localStyles.textInput,
          borderColor: passwordValid ? colors.border : colors.warning,
        }}
        placeholder="Password"
        placeholderTextColor={localStyles.placeholderText.color}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordValid(text.trim().length > 0);
        }}
      />
      {!passwordValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Password
        </MyText>
      )}
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Employee</MyText>
        <Switch
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={isEmployeeActive ? colors.text : colors.text}
          onValueChange={setIsEmployeeActive}
          value={isEmployeeActive}
          style={localStyles.switch}
        />
      </View>
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Supervisor</MyText>
        <Switch
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={isSupervisorActive ? colors.text : colors.text}
          onValueChange={setIsSupervisorActive}
          value={isSupervisorActive}
          style={localStyles.switch}
        />
      </View>
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Admin</MyText>
        <Switch
          trackColor={{ false: colors.border, true: colors.secondary }}
          thumbColor={isAdminActive ? colors.text : colors.text}
          onValueChange={setIsAdminActive}
          value={isAdminActive}
          style={localStyles.switch}
        />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default UserForm;
