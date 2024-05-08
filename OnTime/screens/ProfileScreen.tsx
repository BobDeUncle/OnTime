import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import {useTheme} from '../theme/Colors';
import styles from '../theme/Styles';
import APIClient from '../api/APIClient';
import UserAPI from '../api/UserAPI';
import MyText from '../components/MyText';
import User from '../models/User';

function ProfileScreen(): React.ReactElement {
  const {colors} = useTheme();
  const [user, setUser] = useState<User>();

  const client = new APIClient();
  const userAPI = new UserAPI(client);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userAPI.getUserMe();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user: ', error)
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={{backgroundColor: colors.background}}>
      <MyText style={{color: colors.opText}}>Name: {user ? user.firstName + ' ' + user.lastName : ''}</MyText>
      <MyText style={{color: colors.opText}}>Role: {user && user.roles.length > 0 ? user.roles[0].name : ''}</MyText>
      <MyText style={{color: colors.opText}}>Email: {user ? user.email : ''}</MyText>
    </View>
  );
}

export default ProfileScreen;
