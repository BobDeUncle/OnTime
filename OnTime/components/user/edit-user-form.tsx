import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Switch, ActivityIndicator } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import UserAPI from '../../api/UserAPI';
import RoleAPI from '../../api/RoleAPI';
import Role from '../../models/Role';
import User from '../../models/User'; 
import { useAPIClient } from '../../api/APIClientContext';

interface UserFormProps {
  user: User;
  styles: any;
  showCloseButton: boolean,
  onClose: () => void;
}

const EditUserForm: React.FC<UserFormProps> = ({ user, styles, showCloseButton, onClose }) => {  
  const {colors} = useTheme();

  const { apiClient } = useAPIClient();
  const roleAPI = new RoleAPI(apiClient);
  const userAPI = new UserAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(true);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const lastNameRef = useRef<TextInput>(null);
  const [email, setEmail] = useState(user?.email || '');
  const emailRef = useRef<TextInput>(null);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [isEmployeeActive, setIsEmployeeActive] = useState(false);
  const [isSupervisorActive, setIsSupervisorActive] = useState(false);
  const [rolesData, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await roleAPI.getAllRoles();
        setRoles(rolesData);
        console.log(rolesData);
        setIsAdminActive(user.roles.some(role => role.name === 'admin'));
        setIsEmployeeActive(user.roles.some(role => role.name === 'employee'));
        setIsSupervisorActive(user.roles.some(role => role.name === 'supervisor'));
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [user]);

  const getSelectedRoles = (): Role[] => {
    const selectedRoles: Role[] = [];
    if (isAdminActive) {
      const adminRole = rolesData.find(role => role.name === "admin");
      if (adminRole) selectedRoles.push(adminRole);
    }
    if (isEmployeeActive) {
      const employeeRole = rolesData.find(role => role.name === "employee");
      if (employeeRole) selectedRoles.push(employeeRole);
    }
    if (isSupervisorActive) {
      const supervisorRole = rolesData.find(role => role.name === "supervisor");
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

    // Update validation status
    setFirstNameValid(isFirstNameValid);
    setLastNameValid(isLastNameValid);
    setEmailValid(isEmailValid);

    // If any input is invalid, return early
    if (!isFirstNameValid || !isLastNameValid || !isEmailValid) {
      setLoading(false);
      return;
    }

    const selectedRoles = getSelectedRoles();

    // Show a confirmation popup
    Alert.alert(
      'Submit Updated User',
      `Do you wish to update the user ${firstName} ${lastName} with email as ${email} and role(s) of ${selectedRoles.map(role => role.name).join(", ")}?`,
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
              await userAPI.updateUser(user?._id, {
                firstName,
                lastName,
                email,
                roles: selectedRoles,
              });

              console.log('update user', {
                firstName,
                lastName,
                email,
                roles: selectedRoles,
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
        <MyText style={styles.sectionTitle}>Edit User</MyText>
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
      />
      {!emailValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Email
        </MyText>
      )}
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Employee</MyText>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={isEmployeeActive ? colors.text : colors.text}
            onValueChange={setIsEmployeeActive}
            value={isEmployeeActive}
            style={localStyles.switch}
          />
        )}
      </View>
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Supervisor</MyText>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={isSupervisorActive ? colors.text : colors.text}
            onValueChange={setIsSupervisorActive}
            value={isSupervisorActive}
            style={localStyles.switch}
          />
        )}
      </View>
      <View style={localStyles.roleContainer}>
        <MyText style={localStyles.roleText}>Admin</MyText>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Switch
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={isAdminActive ? colors.text : colors.text}
            onValueChange={setIsAdminActive}
            value={isAdminActive}
            style={localStyles.switch}
          />
        )}
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default EditUserForm;
