// Based on https://medium.com/@mustapha.aitigunaoun/creating-a-stylish-login-form-in-react-native-45e9277f1b9f

import React, {useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from '.././theme/Colors';

const LoginScreen = () => {
  const logo = require('../assets/pacbuild-square-blue.jpg');
  const {colors} = useTheme();

  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Username Entered', `You entered: ${username}`);
    // Alert.alert('Password Entered', `You entered: ${password}`);
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
      backgroundColor: 'green',
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
            value={username}
            onChangeText={setUsername}
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
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
