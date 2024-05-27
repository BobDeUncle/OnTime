import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import EditJobsiteForm from './edit-jobsite-form';
import { useAPIClient } from '../../api/APIClientContext';
import Jobsite from '../../models/Jobsite'; 
import JobsiteAPI from '../../api/JobsiteAPI';

type EditJobsiteButtonProps = {
  jobsite: Jobsite;
  onModalVisibleChange: (visible: boolean) => void;
  refreshList: () => void;
}

const EditJobsiteButton: React.FC<EditJobsiteButtonProps> = ({ jobsite, onModalVisibleChange, refreshList }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const handleDeleteJobsite = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this jobsite?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await jobsiteAPI.deleteJobsite(jobsite._id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete jobsite. Please try again later.");
            } finally {
              refreshList();
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: 60,
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
      width: '80%',
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => {
          setModalVisible(true);
          onModalVisibleChange(true);
        }}>
          <FontAwesomeIcon icon='ellipsis-v' size={20} color={colors.opText}/>
        </Pressable>
        {/* <Pressable onPress={handleDeleteJobsite}>
          <FontAwesomeIcon icon='times' size={20} color={colors.opText} />
        </Pressable> */}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          onModalVisibleChange(false);
        }}>
        <View style={styles.centeredView}>
          <EditJobsiteForm jobsite={jobsite} styles={styles} showCloseButton={true} onClose={() => {
            refreshList();
            setModalVisible(false);
            onModalVisibleChange(false);
          }}/>
        </View>
      </Modal>
    </View>
  );
};

export default EditJobsiteButton;
