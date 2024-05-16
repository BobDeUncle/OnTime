import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import UserForm from './create-user-form';

type NewUserButtonProps = {
  onModalVisibleChange: (visible: boolean) => void;
}

const NewUserButton: React.FC<NewUserButtonProps> = ({ onModalVisibleChange }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
      <Pressable onPress={() => {
        setModalVisible(true);
        onModalVisibleChange(true);
      }}>
        <FontAwesomeIcon icon='plus' size={26} color={colors.opText}/>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          onModalVisibleChange(false);
        }}>
        <View style={styles.centeredView}>
          <UserForm styles={styles} showCloseButton={true} onClose={() => {
            setModalVisible(false);
            onModalVisibleChange(false);
          }}/>
        </View>
      </Modal>
    </View>
  );
};

export default NewUserButton;
