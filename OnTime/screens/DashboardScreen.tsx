import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import MyText from '../components/MyText';
import {useTheme} from '../theme/Colors';

function HomeScreen({}): React.ReactElement {
  const {colors} = useTheme();
  const user = 'user';

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
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <MyText style={styles.welcome}>Welcome, {user}</MyText>
      <View style={styles.section}>
        <MyText style={styles.sectionTitle}>New Timesheet</MyText>
        {/* Add your form fields here */}
        <Button title="Submit" onPress={() => {}} />
      </View>
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

export default HomeScreen;
