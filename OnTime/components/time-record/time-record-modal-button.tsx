import React, {useState} from 'react';
import {View, Button, Modal, StyleSheet} from 'react-native';
import NewTimeRecordForm from './time-record-form';

const NewTimeRecordButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Button title="Add Time Record" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <NewTimeRecordForm />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

export default NewTimeRecordButton;
