// Based on https://medium.com/@mustapha.aitigunaoun/creating-a-stylish-login-form-in-react-native-45e9277f1b9f

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '../theme/Colors';
import AuthAPI from '../api/AuthAPI';
import APIClient from '../api/APIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import MyText from '../components/MyText';

interface LoginScreenProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface AuthData {
  token: string;
}

function LoginScreen({
  setIsAuthenticated,
}: LoginScreenProps): React.ReactElement {
  const logo = require('../assets/pacbuild-square-blue.jpg');
  const {colors} = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailPasswordValid, setIsEmailPasswordValid] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const client = new APIClient();
  const authAPI = new AuthAPI(client);

  const handleLogin = async () => {
    setIsLoading(true);

    // Form Validation
    setIsEmailPasswordValid(true);
    if (email !== '') {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      setEmailError('Email is invalid');
      setIsLoading(false);
      return;
    }
  
    if (password !== '') {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
      setPasswordError('Password is invalid');
      setIsLoading(false);
      return;
    }

    try {
      const authData = await authAPI.addAuth({
        email: email,
        password: password,
      });

      // const authData: AuthData = await authAPI.addAuth({
      //   email: 'admin@test.com.au',
      //   password: '123345678',
      // });

      console.log('Success:', authData);
      await AsyncStorage.setItem('userToken', authData.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
      setIsEmailPasswordValid(false);
      // Alert.alert(
      //   'Error',
      //   'Incorrect email or password. Please try again.',
      //   [
      //     {text: 'OK', onPress: () => console.log('OK Pressed')}
      //   ],
      //   { cancelable: false }
      // );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = () => {
    Alert.alert('You forgot your password.');
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
    greenLine: {
      height: 4,
      width: '50%',
      backgroundColor: colors.secondary,
      marginBottom: 15,
    },
    subtext: {
      fontSize: 13,
      marginBottom: 30,
      fontWeight: 'bold',
      color: 'grey',
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
      color: 'white',
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
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.bottomContainer}>
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
                setEmailError('');
              } else {
                setIsEmailValid(false);
                setEmailError('Email is invalid');
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
                setPasswordError('');
              } else {
                setIsPasswordValid(false);
                setPasswordError('Password is invalid');
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
          <Pressable onPress={handleForgot}>
            <MyText style={styles.forgetText}>Forgot Password?</MyText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
