import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import { useAPIClient } from '../api/APIClientContext';
import UserAPI from '../api/UserAPI';
import MyText from '../components/MyText';
import TimeRecordForm from '../components/time-record/time-record-form'
import {useTheme} from '../theme/Colors';
import User from '../models/User';

function DashboardScreen({}): React.ReactElement {
  const {colors} = useTheme();
  const [user, setUser] = useState<User>();

  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userAPI.getUserMe();
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
      padding: 16,
      backgroundColor: colors.background,
    },
    welcome: {
      color: colors.opText,
      fontSize: 24,
      marginVertical: 16,
      fontWeight: 'bold',
    },
    section: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 15,
    },
  });

  return (
    <View style={styles.container}>
      <MyText style={styles.welcome}>Welcome{user ? ', ' + user.firstName : ''}</MyText>
      <TimeRecordForm styles={styles} showCloseButton={false}/>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}>Monthly Activity</MyText>
        {/* Add your status indicators here */}
      </View>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}>Recent History</MyText>
        {/* Add your history entries here */}
      </View>
    </View>
  );
}

export default DashboardScreen;
