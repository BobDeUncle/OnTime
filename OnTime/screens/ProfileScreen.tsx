import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../theme/Colors';
import styles from '../theme/Styles';
import { useAPIClient } from '../api/APIClientContext';
import UserAPI from '../api/UserAPI';
import MyText from '../components/MyText';
import User from '../models/User';

function ProfileScreen(): React.ReactElement {
  const {colors} = useTheme();
  const [user, setUser] = useState<User>();

  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.background,
    },
    headingText: {
      color: colors.opText,
      fontSize: 24,
      paddingBottom: 10,
      fontWeight: 'bold',
    },
    text: {
      color: colors.opText,
      paddingBottom: 10,
    },
    boldText: {
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <MyText style={styles.headingText}>User Info</MyText>
      <MyText style={styles.text}>
        <MyText style={styles.boldText}>Name:</MyText>
        {user ? ` ${user.firstName} ${user.lastName}` : ''}
      </MyText>
      <MyText style={styles.text}>
        <MyText style={styles.boldText}>Role:</MyText>
        {user && user.roles.length > 0 ? ` ${user.roles[0].name}` : ''}
      </MyText>
      <MyText style={styles.text}>
        <MyText style={styles.boldText}>Email:</MyText>
        {user ? ` ${user.email}` : ''}
      </MyText>
    </View>
  );
}

export default ProfileScreen;
