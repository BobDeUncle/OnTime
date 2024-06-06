import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import { useAPIClient } from '../api/APIClientContext';
import MyText from '../components/MyText';
import TimeRecordForm from '../components/time-record/time-record-form'
import {useTheme} from '../theme/Colors';
import TimeRecordAPI from '../api/TimeRecordAPI';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export interface StatsInitialViewModel {
  day: string,
  week: string,
  month: string,
  sinceInception: string
}

function DashboardScreen({}): React.ReactElement {
  const {colors} = useTheme();
  const { apiClient, user } = useAPIClient(); 
  const timeRecordAPI = new TimeRecordAPI(apiClient);

  const statsInitialViewModel = {
    day: '',
    week: '',
    month: '',
    sinceInception: ''
  }

  const [stats, setStats] = useState(statsInitialViewModel);


  useEffect(() => {
    const getDashboardStats = async () => {
      if (user) {
        const statsResult = await timeRecordAPI.getDashboardStats(user?._id);
        setStats(statsResult);
      }
    }

    getDashboardStats();

  }, [])

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
    sectionText: {
      color: colors.text,
      paddingBottom: 10,

    },
  });

  return (
    <ScrollView style={styles.container}>
      <MyText style={styles.welcome}>Welcome{user ? ', ' + user.firstName : ''}</MyText>
      <TimeRecordForm styles={styles} showCloseButton={false}/>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}><FontAwesomeIcon icon='chart-bar' size={20} color={colors.border} /> Timesheet Totals</MyText>
        <MyText style={styles.sectionText}>Today: {stats.day} hrs</MyText>
        <MyText style={styles.sectionText}>This week: {stats.week} hrs </MyText>
        <MyText style={styles.sectionText}>This month: {stats.month} hrs</MyText>
        <MyText style={styles.sectionText}>All time: {stats.sinceInception} hrs</MyText>
      </View>
    </ScrollView>
  );
}

export default DashboardScreen;
