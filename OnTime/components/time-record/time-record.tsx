import React, { useState } from 'react';
import {View, StyleSheet, Alert, Pressable, Modal, TouchableOpacity} from 'react-native';
import {useTheme} from '../../theme/Colors';
import MyText from '../../components/MyText';
import TimeRecord, { Status } from '../../models/TimeRecord';
import TimeRecordAPI from '../../api/TimeRecordAPI';
import { useAPIClient } from '../../api/APIClientContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import TimeRecordUserUpdateForm from '../../components/time-record/time-record-user-update-form';
import { formatCamelCase } from '../../utils/stringUtils';

interface TimeRecordProps {
  timeRecord: TimeRecord;
  refreshList: () => void;
}

const TimeRecordItem: React.FC<TimeRecordProps> = ({
  timeRecord,
  refreshList,
}) => {
  const {colors} = useTheme();

  const { user } = useAPIClient(); 
  const { apiClient } = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);

  const isAdmin = user ? user.roles.some(role => role.name === 'admin') : false;

  const [editModalOpen, setEditModalOpen] = useState(false);

  timeRecord.startTime = new Date(timeRecord.startTime);
  timeRecord.endTime = new Date(timeRecord.endTime);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this time record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onUpdate = async (newTimeRecord: TimeRecord) => {
    try {
      await timeRecordAPI.updateTimeRecord(newTimeRecord._id, newTimeRecord);
      refreshList();
    } catch (error) {
      console.error('Error updating new timesheet:', error);
    } finally {
      setEditModalOpen(false);
    }
  }

  const onClose = () => {
    setEditModalOpen(false);
  }

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
    topHalfContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    line: {
      height: 1.3,
      backgroundColor: colors.opText,
      padding: 0,
    },
    verticalLine: {
      width: 1.3,
      backgroundColor: colors.opText,
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
      color: colors.opText,
    },
    secondText: {
      fontSize: 14,
      // fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 5,
      textAlign: 'center',
      color: colors.opText,
    },
    approvalText: {
      fontSize: 14,
      fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingTop: 1,
      paddingBottom: 1,
      textAlign: 'center',
      color: colors.opText,
    },
    statusBackground: {
      paddingHorizontal: 6,
      marginBottom: 10,
    },
    editIcon: {
      position: 'absolute',
      zIndex: 100,
      right: 25,
      top: 25,
    },
    deleteIcon: {
      position: 'absolute',
      zIndex: 100,
      right: 60,
      top: 25,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 400,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHalfContainer}>
        <View style={{ flex: 1 }}>
          <MyText style={{
            ...styles.text,
            paddingTop: 12,
          }}>
            Date: {new Date(timeRecord.date.toString()).toLocaleDateString()}
          </MyText>
          {isAdmin && (
            timeRecord.employee ? (
              <>
                <MyText style={styles.text}>Employee: {timeRecord.employee.firstName} {timeRecord.employee.lastName}</MyText>
              </>
            ) : (
              <MyText style={styles.text}>Employee: N/A</MyText>
            )
          )}
          <MyText style={styles.text}>Jobsite: {timeRecord.jobsite.name}, {timeRecord.jobsite.city}</MyText>
          <MyText style={styles.text}>
            Time: {timeRecord.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: undefined, hour12: true })} - {timeRecord.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: undefined, hour12: true })}
          </MyText>
          <MyText style={styles.text}>Break (mins): {timeRecord.breakHours ? timeRecord.breakHours * 60 : 0}</MyText>
          <MyText style={styles.text}>Type: {formatCamelCase(timeRecord.recordType)}</MyText>
        </View>
        <Pressable
          onPress={() => {
            setEditModalOpen(true);
          }}
          style={styles.editIcon}>
          <FontAwesomeIcon icon="pen-to-square" size={26} />
        </Pressable>
        {isAdmin && (
          <Pressable
            onPress={handleDelete}
            style={styles.deleteIcon}>
            <FontAwesomeIcon icon="times" size={26} />
          </Pressable>
        )}
      </View>
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.column}>
          <MyText style={styles.secondText}>
            Total Hours: {timeRecord.recordTotalHours.toFixed(2)}
          </MyText>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.column}>
          <MyText style={styles.secondText}>
            Approval status:
          </MyText>
          <View style={[styles.statusBackground, {backgroundColor: getApprovalColor(timeRecord.status)}]}>
            <MyText style={styles.approvalText}>
              {formatCamelCase(timeRecord.status)}
            </MyText>
          </View>
        </View>
      </View>

      <Modal
        style={styles.modalContainer}
        transparent={true}
        visible={editModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setEditModalOpen(false);
        }}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setEditModalOpen(false)}>
          <TimeRecordUserUpdateForm
            timeRecord={timeRecord}
            onUpdate={onUpdate}
            onClose={onClose}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TimeRecordItem;
