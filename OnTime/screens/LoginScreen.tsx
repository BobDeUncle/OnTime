// Partly based on https://medium.com/@mustapha.aitigunaoun/creating-a-stylish-login-form-in-react-native-45e9277f1b9f

import React, {createRef, useState, useEffect, RefObject} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useAPIClient } from '../api/APIClientContext';
import AuthAPI from '../api/AuthAPI';
import {useTheme} from '../theme/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import isEmail from 'validator/lib/isEmail';
import { decodeToken } from '../utils/authUtils';

import MyText from '../components/MyText';

function LoginScreen(): React.ReactElement {
  const { apiClient, setIsAuthenticated, setUser } = useAPIClient();
  const authAPI = new AuthAPI(apiClient);
  const logo = require('../assets/pacbuild-square-blue.jpg');
  const {colors} = useTheme();

  const [resetStage, setResetStage] = useState('login'); // 'login', 'forgotPassword', 'veriCode', 'resetPassword', 'success'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailPasswordValid, setIsEmailPasswordValid] = useState(true);

  const handleLogin = async () => {
    setIsLoading(true);

    // Form Validation
    setIsEmailPasswordValid(true);
    if (email !== '' && isEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      setIsLoading(false);
      return;
    }
  
    if (password !== '') {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
      setIsLoading(false);
      return;
    }

   try {
      const authData = await authAPI.addAuth({ email, password });
      await AsyncStorage.setItem('userToken', authData.token);
      setIsAuthenticated(true);

      // Decode the token and set the user details
      const decoded = decodeToken(authData.token);
      if (decoded) { 
        setUser({
          _id: decoded._id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          roles: decoded.roles,
        })
      };
    } catch (error) {
      console.error('Error:', error);
      setIsEmailPasswordValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  // FORGOT PASSWORD
  const [FPEmail, setFPEmail] = useState('');
  const [isFPEmailValid, setIsFPEmailValid] = useState(true);

  const handleForgotPassword = async () => {
    console.log('handleForgotPassword');
    setIsLoading(true);

    // Form Validation
    setIsFPEmailValid(true);
    if (FPEmail !== '' && isEmail(FPEmail)) {
      setIsFPEmailValid(true);
    } else {
      setIsFPEmailValid(false);
      setIsLoading(false);
      return;
    }

    try {
      const FPData = await authAPI.forgotPassword({
        email: FPEmail,
      });
      console.log(FPData);  
      setResetStage('veriCode');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);      
    }
  };

  // VERIFICATION CODE
  const numCodeInputs = 6;
  const [veriCodeInputs, setVeriCodeInputs] = useState<string[]>(Array(numCodeInputs).fill(''));
  const veriCodeRefs: RefObject<TextInput>[] = Array.from({ length: numCodeInputs }, () => createRef<TextInput>());
  const [isVeriCodeValid, setIsVeriCodeValid] = useState(true);

  const handleVeriCodeChange = (text: string, index: number) => {
    const newInputs = [...veriCodeInputs];
    newInputs[index] = text;
    setVeriCodeInputs(newInputs);
    if (text && index < numCodeInputs - 1) {
      veriCodeRefs[index + 1].current?.focus();
    } else if (text) {
      veriCodeRefs[index].current?.blur();
      setIsVeriCodeValid(true);
    }
  };

  const handleVeriCode = async () => {
    setIsLoading(true);

    // Form Validation
    const isEveryInputFilled = veriCodeInputs.every(input => input.trim().length === 1 && /^\d$/.test(input));
    if (!isEveryInputFilled) {
      setIsVeriCodeValid(false);
      setIsLoading(false);
      return;
    };

    setResetStage('resetPassword');
    setIsLoading(false);
  };

  // RESET PASSWORD
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleResetPassword = async () => {
    console.log('handleResetPassword');
    setIsLoading(true);

    // Form Validation
    if (newPassword !== '') {
      setIsNewPasswordValid(true);
    } else {
      setIsNewPasswordValid(false);
      setIsLoading(false);
      return;
    }

    if (confirmPassword == '') {
      setConfirmPasswordMessage('Invalid Password');
      setIsConfirmPasswordValid(false);
      setIsLoading(false);
      return;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordMessage('Passwords must be the same');
      setIsConfirmPasswordValid(false);
      setIsLoading(false);
      return;
    } else {
      setIsConfirmPasswordValid(true);
    };

    try {
      const RPData = await authAPI.resetPassword({
        email: FPEmail,
        code: veriCodeInputs.join(''),
        password: newPassword,
        confirmationPassword: confirmPassword,
      });
      console.log(RPData);
      setResetStage('success');
    } catch (error) {
      console.error('Error:', error);
      setResetStage('veriCode');
    } finally {
      setIsLoading(false);
    }
  };

  // SUCCESS
  const handleSuccessContinue = () => {
    setResetStage('login')
  };

  const renderBottomContainerContent = () => {
    switch (resetStage) {
      case 'login':
        return (
          <>
            <MyText style={styles.welcome}>Welcome</MyText>
            <View style={styles.greenLine} />
            <MyText style={styles.subtext}>Please login to your account</MyText>
            <View style={styles.inputView}>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isEmailValid ? colors.border : colors.warning,
                }}
                placeholder="Email"
                placeholderTextColor={isEmailValid ? colors.border : colors.warning}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (text !== '') {
                    setIsEmailValid(true);
                  } else {
                    setIsEmailValid(false);
                  }
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isPasswordValid ? colors.border : colors.warning,
                }}
                placeholder="Password"
                placeholderTextColor={isPasswordValid ? colors.border : colors.warning}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text !== '') {
                    setIsPasswordValid(true);
                  } else {
                    setIsPasswordValid(false);
                  }
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            {!isEmailValid && (
              <MyText style={styles.invalidForm}>
                <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Email
              </MyText>
            )}
            {!isPasswordValid && (
              <MyText style={styles.invalidForm}>
                <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Password
              </MyText>
            )}
            {!isEmailPasswordValid && (
              <MyText style={styles.invalidForm}>
                <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Email or Password
              </MyText>
            )}
            <View style={styles.buttonView}>
              <Pressable
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <MyText style={styles.buttonText}>LOGIN</MyText>
                )}
              </Pressable>
            </View>
            <View style={styles.forgotPasswordView}>
              <Pressable onPress={() => setResetStage('forgotPassword')}>
                <MyText style={styles.forgetText}>Forgot Password?</MyText>
              </Pressable>
            </View>
          </>
        );
      case 'forgotPassword':
        return (
          <>
            <View style={styles.header}>
              <Pressable onPress={() => setResetStage('login')}>
                <FontAwesomeIcon icon="chevron-left" size={24} style={styles.iconContainer} />
              </Pressable>
              <View style={styles.flexContainer} />
              <MyText style={styles.subMenuHeaderText}>Forgot Password?</MyText>
              <View style={styles.flexContainer} />
              <View style={styles.iconPlaceholder} /> 
            </View>
            <View style={styles.greenLine} />
            <MyText style={styles.subtext}>Enter your work email below and we will send a message to reset your password</MyText>
            <View style={styles.inputView}>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isFPEmailValid ? colors.border : colors.warning,
                }}
                placeholder="Email"
                placeholderTextColor={isFPEmailValid ? colors.border : colors.warning}
                keyboardType="email-address"
                value={FPEmail}
                onChangeText={(text) => {
                  setFPEmail(text);
                  if (text !== '') {
                    setIsFPEmailValid(true);
                  } else {
                    setIsFPEmailValid(false);
                  }
                }}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {!isFPEmailValid && (
                <MyText style={styles.invalidForm}>
                  <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Email
                </MyText>
              )}
              <Pressable 
                style={styles.button} 
                onPress={handleForgotPassword}
                disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <MyText style={styles.buttonText}>Continue</MyText>
                  )}
              </Pressable>
            </View>
          </>
        );
      case 'veriCode':
        return (
          <>
            <View style={styles.header}>
              <Pressable onPress={() => setResetStage('forgotPassword')}>
                <FontAwesomeIcon icon="chevron-left" size={24} style={styles.iconContainer} />
              </Pressable>
              <View style={styles.flexContainer} />
              <MyText style={styles.subMenuHeaderText}>2-Step Verification</MyText>
              <View style={styles.flexContainer} />
              <View style={styles.iconPlaceholder} /> 
            </View>
            <View style={styles.greenLine} />
            <MyText style={styles.subtext}>Enter the 6-digit code sent to {FPEmail}</MyText>
            <View style={styles.inputView}>
              <View style={styles.veriCodeContainer}>
                {veriCodeInputs.map((input, index) => (
                  <TextInput
                    key={index}
                    style={{
                      ...styles.veriCodeInputBox,
                      borderColor: isVeriCodeValid ? colors.secondary : colors.warning,
                    }}
                    value={input}
                    onChangeText={(text) => handleVeriCodeChange(text, index)}
                    keyboardType="number-pad"
                    returnKeyType={'done'}
                    maxLength={1}
                    ref={veriCodeRefs[index]}
                    textAlign="center"
                  />
                ))}
              </View>
              {!isVeriCodeValid && (
                <MyText style={styles.invalidForm}>
                  <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Code
                </MyText>
              )}
              <Pressable onPress={handleForgotPassword} style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
                <MyText style={{...styles.subtext, paddingTop: 20, marginBottom: 5, color: colors.opText}}>
                  Didn't get a code?{' '}
                  <MyText style={{...styles.subtext, ...styles.hyperlink}}>
                    Click to resend
                  </MyText>
                </MyText>
              </Pressable>
              <Pressable style={styles.button} onPress={handleVeriCode}>
                <MyText style={styles.buttonText}>Continue</MyText>
              </Pressable>
            </View>
          </>
        );
      case 'resetPassword':
        return (
          <>
            <View style={styles.header}>
              <MyText style={styles.subMenuHeaderText}>Reset Password</MyText>
            </View>
            <View style={styles.greenLine} />
            <MyText style={{...styles.subtext, color: colors.opText}}>{FPEmail}</MyText>
            <MyText style={styles.subtext}>Enter a new password and reconfirm</MyText>
            <View style={styles.inputView}>
              <View style={{...styles.passwordView, borderColor: isNewPasswordValid ? colors.border : colors.warning}}>
                <TextInput
                  style={{
                    ...styles.input,
                    ...styles.passwordInput,
                    borderColor: isNewPasswordValid ? colors.border : colors.warning,
                  }}
                  placeholder="New Password"
                  placeholderTextColor={isNewPasswordValid ? colors.border : colors.warning}
                  secureTextEntry={!isNewPasswordVisible}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setIsNewPasswordValid(text !== '');
                  }}
                />
                <Pressable
                  onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <FontAwesomeIcon icon={isNewPasswordVisible ? 'eye-slash' : 'eye'} color={colors.border} />
                </Pressable>
              </View>
              {!isNewPasswordValid && (
                <MyText style={styles.invalidForm}>
                  <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> Invalid Password
                </MyText>
              )}
              <View style={{...styles.passwordView, borderColor: isConfirmPasswordValid ? colors.border : colors.warning}}>
                <TextInput
                  style={{
                    ...styles.input,
                    ...styles.passwordInput,
                  }}
                  placeholder="Confirm Password"
                  placeholderTextColor={isConfirmPasswordValid ? colors.border : colors.warning}
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text !== '') {
                      setIsConfirmPasswordValid(true);
                    } else {
                      setIsConfirmPasswordValid(false);
                    }
                  }}
                />
                <Pressable
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <FontAwesomeIcon icon={isConfirmPasswordVisible ? 'eye-slash' : 'eye'} color={colors.border} />
                </Pressable>
              </View>
              {!isConfirmPasswordValid && (
                <MyText style={styles.invalidForm}>
                  <FontAwesomeIcon icon='exclamation' style={styles.invalidFormIcon}/> {confirmPasswordMessage}
                </MyText>
              )}
              <Pressable style={styles.button} onPress={handleResetPassword}>
                <MyText style={styles.buttonText}>Reset Password</MyText>
              </Pressable>
            </View>
          </>
        );
      case 'success':
        return (
          <>
            <FontAwesomeIcon icon='circle-check' style={styles.successIcon} size={50}/>
            <View style={{...styles.header, marginTop : 0}}>
              <MyText style={styles.subMenuHeaderText}>New Password Created</MyText>
            </View>
            <View style={styles.greenLine} />
            <MyText style={styles.subtext}>A new password has been successfully created. Please login using the new password.</MyText>
            <View style={styles.inputView}>
              <Pressable style={{...styles.button, marginTop: 30}} onPress={handleSuccessContinue}>
                <MyText style={styles.buttonText}>LOGIN</MyText>
              </Pressable>
            </View>
          </>
        )
    };
  };

  const styles = StyleSheet.create({
    mainContainer: {
      paddingTop: 0,
      backgroundColor: colors.primary,
      flex: 1,
    },
    topContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 30,
      backgroundColor: colors.primary,
      flex: 1,
    },
    bottomContainer: {
      alignItems: 'center',
      backgroundColor: colors.background,
      height: 450,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      flex: 1,
    },
    image: {
      height: 300,
      width: 300,
    },
    welcome: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 30,
      paddingBottom: 5,
      color: colors.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 65,
      marginTop: 10,
    },
    iconContainer: {
      paddingHorizontal: 30,
    },
    iconPlaceholder: {
      width: 60,  // Ensure this is equal to the total width of the iconContainer including padding
    },
    flexContainer: {
      flex: 1,
    },
    subMenuHeaderText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    greenLine: {
      height: 4,
      width: '50%',
      backgroundColor: colors.secondary,
      marginBottom: 15,
    },
    subtext: {
      fontSize: 13,
      marginBottom: 30,
      paddingHorizontal: 10,
      fontWeight: 'bold',
      color: colors.border,
      textAlign: 'center',
    },
    invalidForm: {
      color: colors.warning,
      paddingBottom: 10,
    },
    invalidFormIcon: {
      color: colors.warning,
    },
    inputView: {
      gap: 15,
      width: '100%',
      paddingHorizontal: 40,
      marginBottom: 10,
      paddingBottom: 10,
    },
    input: {
      height: 50,
      paddingHorizontal: 20,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 7,
      paddingLeft: 10,
    },
    switch: {
      flexDirection: 'row',
      gap: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      height: 45,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    buttonView: {
      width: '100%',
      paddingHorizontal: 40,
    },
    forgotPasswordView: {
      width: '100%',
      paddingHorizontal: 40,
      paddingTop: 20,
    },
    forgetText: {
      fontSize: 11,
      color: colors.primary,
      textAlign: 'right',
    },
    veriCodeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 0,
    },
    veriCodeInputBox: {
      width: 45,
      height: 45,
      borderWidth: 2,
      borderRadius: 10,
      fontSize: 20,
      color: colors.opText,
    },
    hyperlink: {
      textDecorationLine: 'underline',
      color: colors.opText,
    },
    passwordView: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: 8, 
      borderWidth: 2,
      paddingHorizontal: 8, 
    },
    passwordInput: {
      flex: 1, 
      borderWidth: 0,
    },
    eyeIcon: {
      padding: 10,
    },
    successIcon: {
      marginTop: 25,
      color: colors.secondary,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
      </View>
      <KeyboardAvoidingView 
        style={[styles.bottomContainer]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {renderBottomContainerContent()}
      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;
