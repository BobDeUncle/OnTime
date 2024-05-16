import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import EditUserForm from './edit-user-form';
import { useAPIClient } from '../../api/APIClientContext';
import User from '../../models/User'; 
import UserAPI from '../../api/UserAPI';

type EditUserButtonProps = {
  user: User;
  onModalVisibleChange: (visible: boolean) => void;
  refreshList: () => void;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ user, onModalVisibleChange, refreshList }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  const handleDeleteUser = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
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
              await userAPI.deleteUser(user._id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete user. Please try again later.");
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
        <Pressable onPress={handleDeleteUser}>
          <FontAwesomeIcon icon='times' size={20} color={colors.opText} />
        </Pressable>
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
          <EditUserForm user={user} styles={styles} showCloseButton={true} onClose={() => {
            setModalVisible(false);
            onModalVisibleChange(false);
          }}/>
        </View>
      </Modal>
    </View>
  );
};

export default EditUserButton;
