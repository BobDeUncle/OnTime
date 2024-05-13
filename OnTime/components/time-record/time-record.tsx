import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useTheme} from '../../theme/Colors';
import MyText from '../../components/MyText';
import TimeRecord, { Status } from '../../models/TimeRecord';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import { useAPIClient } from '../../api/APIClientContext';

interface TimeRecordProps {
  timeRecord: TimeRecord;
  refreshList: () => void;
}

const TimeRecordItem: React.FC<TimeRecordProps> = ({
  timeRecord,
  refreshList,
}) => {
  const {colors} = useTheme();

  const { apiClient } = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);

  timeRecord.startTime = new Date(timeRecord.startTime);
  timeRecord.endTime = new Date(timeRecord.endTime);

  const handleDelete = async () => {
    try {
      await timeRecordAPI.deleteTimeRecord(timeRecord._id);

      refreshList();
    } catch (error) {
      console.error('Error deleting time record:', error);
      Alert.alert(
        'Error',
        'Failed to delete time record. Please try again later.',
      );
    }
  };

  const getApprovalColor = (status: Status) => {
    switch (status) {
      case Status.approved:
        return 'rgba(0, 128, 0, 0.5)'; // Semi-transparent green
      case Status.pending:
        return 'rgba(255, 165, 0, 0.5)'; // Semi-transparent orange
      case Status.denied:
        return 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
      default:
        return 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
    }
  };

  const styles = StyleSheet.create({
    container: {
      margin: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
    },
    line: {
      height: 1.3,
      backgroundColor: 'black',
      padding: 0,
    },
    verticalLine: {
      width: 1.3,
      backgroundColor: 'black',
    },
    row: {
      flexDirection: 'row',
    },
    column: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 14,
      paddingHorizontal: 12,
      paddingTop: 0,
      paddingBottom: 4,
    },
    secondText: {
      fontSize: 14,
      // fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 5,
      textAlign: 'center',
    },
    approvalText: {
      fontSize: 14,
      fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingTop: 1,
      paddingBottom: 1,
      textAlign: 'center',
    },
    statusBackground: {
      paddingHorizontal: 6,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <MyText style={{
        ...styles.text,
        paddingTop: 12,
      }}>
        Date: {new Date(timeRecord.date.toString()).toLocaleDateString()}
      </MyText>
      <MyText style={styles.text}>Jobsite: {timeRecord.jobsite.name}, {timeRecord.jobsite.city}</MyText>
      <MyText style={styles.text}>
        Time: {timeRecord.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: undefined, hour12: true })} - {timeRecord.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: undefined, hour12: true })}
      </MyText>
      {/* <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <MyText style={styles.buttonText}>Delete</MyText>
      </TouchableOpacity> */}
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.column}>
          <MyText style={styles.secondText}>
            Total Hours: {/* Calculate total hours here */}
          </MyText>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.column}>
          <MyText style={styles.secondText}>
            Approval status:
          </MyText>
          <View style={[styles.statusBackground, {backgroundColor: getApprovalColor(timeRecord.status)}]}>
            <MyText style={styles.approvalText}>
              {timeRecord.status}
            </MyText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimeRecordItem;
