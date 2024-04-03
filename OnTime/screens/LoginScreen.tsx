// Based on https://medium.com/@mustapha.aitigunaoun/creating-a-stylish-login-form-in-react-native-45e9277f1b9f

import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '../theme/Colors';
import AuthAPI from '../api/AuthAPI';
import APIClient from '../api/APIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [click, setClick] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const client = new APIClient();
  const authAPI = new AuthAPI(client);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // const authData = await authAPI.addAuth({
      //   email: email,
      //   password: password,
      // });

      const authData: AuthData = await authAPI.addAuth({
        email: 'hannahgmacca@gmail.com',
        password: '123345678',
      });

      console.log('Success:', authData);
      await AsyncStorage.setItem('userToken', authData.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error:', error);
      // handle login error here
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
      backgroundColor: colors.primary,
      flex: 1,
    },
    bottomContainer: {
      alignItems: 'center',
      backgroundColor: colors.background,
      height: 400,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    image: {
      height: 160,
      width: 170,
    },
    welcome: {
      fontSize: 30,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      textAlign: 'center',
      paddingTop: 30,
      paddingBottom: 5,
      color: colors.primary,
    },
    greenLine: {
      height: 4,
      width: '50%',
      backgroundColor: colors.secondary,
      marginBottom: 10,
    },
    subtext: {
      marginBottom: 20,
    },
    inputView: {
      gap: 15,
      width: '100%',
      paddingHorizontal: 40,
      marginBottom: 5,
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
    rememberView: {
      width: '100%',
      paddingHorizontal: 50,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 8,
      paddingBottom: 5,
    },
    switch: {
      flexDirection: 'row',
      gap: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rememberText: {
      paddingLeft: 7,
      fontSize: 13,
    },
    forgetText: {
      fontSize: 11,
      color: colors.primary,
    },
    button: {
      backgroundColor: colors.primary,
      height: 45,
      borderColor: 'gray',
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
      paddingHorizontal: 50,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.welcome}>Welcome</Text>
        <View style={styles.greenLine} />
        <Text style={styles.subtext}>Please login to your account</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'grey'}
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'grey'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.rememberView}>
          <View style={styles.switch}>
            <Switch
              value={click}
              onValueChange={setClick}
              trackColor={{true: 'blue', false: 'gray'}}
              thumbColor={'blue'}
            />
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>
          <View>
            <Pressable onPress={handleForgot}>
              <Text style={styles.forgetText}>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
