// TO DO
// Make work, copy from time-record-filter

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, Text, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';

type UserFilterProps = {
  onApply: (filters: any) => void;
  onModalVisibleChange: (visible: boolean) => void;
};

const UserFilter: React.FC<UserFilterProps> = ({ onApply, onModalVisibleChange }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');

  // Handler to apply filters
  const applyFilters = () => {
    onApply({ name: nameFilter, email: emailFilter });
    setModalVisible(false);
    onModalVisibleChange(false);
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      width: '100%',
      backgroundColor: colors.background,
      padding: 35,
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    input: {
      width: '100%',
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
    },
  });

  return (
    <View>
      <Pressable onPress={() => {
        setModalVisible(true);
        onModalVisibleChange(true);
      }}>
        <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          onModalVisibleChange(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text onPress={() => {
                setModalVisible(false);
                onModalVisibleChange(false);
              }}>Cancel</Text>
              <Text style={styles.modalTitle}>Filter Users</Text>
              <Text onPress={() => {
                setNameFilter('');
                setEmailFilter('');
                setModalVisible(false);
                onModalVisibleChange(false);
              }}>Reset</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setNameFilter}
              value={nameFilter}
              placeholder="Filter by name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmailFilter}
              value={emailFilter}
              placeholder="Filter by email"
            />
            <Pressable style={{ marginTop: 20 }} onPress={applyFilters}>
              <Text>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserFilter;
