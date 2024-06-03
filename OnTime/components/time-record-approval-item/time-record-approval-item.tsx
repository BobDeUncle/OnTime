import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../theme/Colors';
import MyText from '../MyText';
import TimeRecord, {Status} from '../../models/TimeRecord';
import {useAPIClient} from '../../api/APIClientContext';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

interface TimeRecordApprovalItemProps {
  timeRecord: TimeRecord;
  onEditSelect: (_timeRecord: TimeRecord) => void;
  refreshRecords: () => {};
}

const TimeRecordApprovalItem: React.FC<TimeRecordApprovalItemProps> = ({
  timeRecord,
  refreshRecords,
  onEditSelect,
}) => {
  const {colors} = useTheme();
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingDeny, setLoadingDeny] = useState(false);

  const {apiClient} = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);

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

  const handleApproval = async () => {
    try {
      setLoadingApproval(true);
      await timeRecordAPI.updateTimeRecord(timeRecord._id, {
        ...timeRecord,
        status: Status.approved,
      });
      refreshRecords();
    } finally {
      setLoadingApproval(false);
    }
  };

  const handleDeny = async () => {
    try {
      setLoadingDeny(true);
      await timeRecordAPI.updateTimeRecord(timeRecord._id, {
        ...timeRecord,
        status: Status.denied,
      });
      refreshRecords();
    } finally {
      setLoadingDeny(false);
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
      width: 320,
      margin: 10,
      backgroundColor: 'black',
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    denyButton: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      borderColor: 'black',
      borderWidth: 1,
    },
    denyButtonText: {
      color: 'black',
      fontWeight: 'bold',
    },
    editIcon: {
      position: 'absolute',
      zIndex: 100,
      right: 25,
      top: 25,
    },
  });

  if (timeRecord)
    return (
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            onEditSelect(timeRecord);
          }}
          style={styles.editIcon}>
          <FontAwesomeIcon icon="pen-to-square" size={26} />
        </Pressable>
        <View style={styles.column}>
          <MyText style={styles.secondText}> </MyText>
          <View
            style={[
              styles.statusBackground,
              {backgroundColor: getApprovalColor(timeRecord.status)},
            ]}>
            <MyText style={styles.approvalText}>
              Status: {timeRecord.status}
            </MyText>
          </View>
          <MyText style={styles.secondText}>
            Name: {timeRecord.employee.firstName} {timeRecord.employee.lastName}
          </MyText>
          <MyText style={styles.secondText}>
            Date: {new Date(timeRecord.date.toString()).toLocaleDateString()}
          </MyText>

          <View style={styles.line} />

          <MyText style={styles.text}>
            Jobsite: {timeRecord.jobsite.name}, {timeRecord.jobsite.city}
          </MyText>

          <MyText style={styles.text}>
            Time:{' '}
            {new Date(timeRecord.startTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: undefined,
              hour12: true,
            })}{' '}
            -{' '}
            {new Date(timeRecord.endTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: undefined,
              hour12: true,
            })}
          </MyText>

          <MyText style={styles.text}>
            Break Time (mins): {timeRecord.breakHours * 60}
          </MyText>

          <View style={styles.line} />
          <View style={styles.row}>
            <View style={styles.column}>
              <MyText style={styles.secondText}>
                Total Hours: {timeRecord.recordTotalHours.toFixed(2)}
              </MyText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.denyButton}
              onPress={handleDeny}
              disabled={loadingDeny}>
              {loadingDeny ? (
                <ActivityIndicator size="small" color={colors.opText} />
              ) : (
                <MyText style={styles.denyButtonText}>DENY</MyText>
              )}
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={handleApproval}
              disabled={loadingApproval}>
              {loadingApproval ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <MyText style={styles.buttonText}>APPROVE</MyText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
};

export default TimeRecordApprovalItem;
