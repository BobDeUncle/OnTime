import React, {useState} from 'react';
import {View, Button, Modal, Pressable, StyleSheet} from 'react-native';
import TimeRecordForm from './time-record-form';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {useTheme} from '../../theme/Colors';

const NewTimeRecordButton: React.FC = () => {
  const {colors} = useTheme();

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
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      elevation: 5,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setModalVisible(true)}>
        <FontAwesomeIcon icon='plus' size={26} color={colors.opText}/>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TimeRecordForm styles={styles}/>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewTimeRecordButton;
