import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import { useAPIClient } from '../../api/APIClientContext';
import TimeRecordAPI from '../../api/TimeRecordAPI';

interface Props {
  filters: {
    jobsites: string[];
    employees: string[];
    status: string;
    startDate: string;
    endDate: string;
    sortOrder: string;
  };
  onModalVisibleChange: (visible: boolean) => void;
}

const TimeRecordExportButton: React.FC<Props> = ({ filters, onModalVisibleChange }) => {
  const { colors } = useTheme();
  const { apiClient } = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = {
        export: true,
        jobsites: filters.jobsites,
        employees: filters.employees,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortOrder: filters.sortOrder,
      };

      const response = await timeRecordAPI.getAllTimeRecords(params);
      setModalMessage({
        title: 'Export was successful',
        body: 'Please check your email for the CSV file.',
      });
      console.log('Export successful', response);
    } catch (error) {
      setModalMessage({
        title: 'Error exporting time records',
        body: 'An error occurred while exporting the time records. Please try again or contact your system administrator.',
      });
      console.error('Error exporting time records:', error);
    } finally {
      setLoading(false);
      setModalVisible(true);
      onModalVisibleChange(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    onModalVisibleChange(false);
  };

  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
    },
    modalTitle: {
      marginBottom: 10,
      textAlign: 'center',
      fontSize: 18,
      color: colors.opText,
      fontWeight: 'bold',
    },
    modalBody: {
      marginBottom: 20,
      textAlign: 'center',
      fontSize: 16,
      color: colors.opText,
    },
    modalButton: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      width: '100%',
      backgroundColor: colors.primary,
    },
    textStyle: {
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View>
      <Pressable onPress={handleExport} disabled={loading} style={styles.button}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.opText} />
        ) : (
          <FontAwesomeIcon icon="file-export" size={26} color={colors.opText} />
        )}
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalMessage.title}</Text>
            <Text style={styles.modalBody}>{modalMessage.body}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimeRecordExportButton;
