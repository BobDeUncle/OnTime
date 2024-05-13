import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MyText from '../../components/MyText';
import { useTheme } from '../../theme/Colors';
import UserAPI from '../../api/UserAPI';
import { useAPIClient } from '../../api/APIClientContext';

interface UserFormProps {
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
    const isEmailValid = validateEmail(email);
    setEmailValid(isEmailValid);

    if (!firstName || !lastName || !isEmailValid) {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
      return;
    }

    try {
      const newUser = { firstName, lastName, email, role };
      //await userAPI.createUser(newUser);
      Alert.alert("Success", "User created successfully");
      onClose();  // Close the form modal
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert("Error", "Failed to create user. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MyText style={styles.title}>New User</MyText>
        <Button title="Close" onPress={onClose} />
      </View>
      <TextInput
        style={[styles.input, !firstName && formSubmitted ? styles.invalidInput : {}]}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={[styles.input, !lastName && formSubmitted ? styles.invalidInput : {}]}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={[styles.input, !emailValid && formSubmitted ? styles.invalidInput : {}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role (optional)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  invalidInput: {
    borderColor: 'red',
  }
});

export default UserForm;
