import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AuthAPI from '../../api/AuthAPI';
import { useAPIClient } from '../../api/APIClientContext';
import User from '../../models/User';
import { validatePassword } from '../../utils/passwordValidation';

interface ChangePasswordFormProps {
  user: User;
  styles: any;
  showCloseButton: boolean;
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ user, styles, showCloseButton, onClose }) => {
  const { colors } = useTheme();
  const { apiClient } = useAPIClient();
  const authAPI = new AuthAPI(apiClient);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handlePasswordChange = async () => {
    const validation = validatePassword(newPassword, confirmPassword);

    if (!validation.isValid) {
      setPasswordValid(false);
      setPasswordErrorMessage(validation.message);
      return;
    }

    try {
      await authAPI.updatePassword({
        userId: user._id,
        password: newPassword,
        confirmationPassword: confirmPassword,
      });

      Alert.alert('Success', 'Password updated successfully');
      if (onClose) onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again later.');
      console.log(error);
    }
  };

  const localStyles = StyleSheet.create({
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
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
    },
    container: {
      flex: 1,
      paddingTop: 10,
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>Change Password</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text}/>
          </Pressable>
        )}
      </View>
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: passwordValid ? colors.border : colors.warning,
        }}
        placeholder="New Password"
        placeholderTextColor={localStyles.placeholderText.color}
        secureTextEntry
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          setPasswordValid(true);
        }}
      />
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: passwordValid ? colors.border : colors.warning,
        }}
        placeholder="Confirm Password"
        placeholderTextColor={localStyles.placeholderText.color}
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setPasswordValid(true);
        }}
        returnKeyType="done"
        onSubmitEditing={handlePasswordChange}
      />
      {!passwordValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> {passwordErrorMessage}
        </MyText>
      )}
      <Button title="Change Password" onPress={handlePasswordChange} />
    </View>
  );
};

export default ChangePasswordForm;
