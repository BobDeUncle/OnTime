// TO DO
// Make work, copy from time-record-filter

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, TextInput, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../theme/Colors';
import MyText from '../../components/MyText';

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
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      width: '100%',
      backgroundColor: colors.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 35,
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      paddingHorizontal: 30,
    },
    modalSectionTitleView: {
      textAlign: 'left',
      paddingHorizontal: 0,
      paddingBottom: 10,
      alignSelf: 'stretch',
    },
    modalSectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalButtons: {
      color: colors.warning,
    },
    input: {
      width: '100%',
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
    },
    applyButtonContainer: {
      alignSelf: 'stretch',
      alignItems: 'flex-end',
    },
    applyButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
    },
    applyButtonText: {
      color: colors.text,
    },
  });

  return (
    <View>
      <View>
        <Pressable onPress={() => {
          setModalVisible(true);
          onModalVisibleChange(true);
        }}>
          <FontAwesomeIcon icon='sliders' size={26} color={colors.opText}/>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          onModalVisibleChange(false);
        }}
      >
        <KeyboardAvoidingView 
          style={styles.centeredView} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableHighlight
                onPress={() => {
                  onModalVisibleChange(false);
                  setModalVisible(false);
                }}
                underlayColor='transparent'
              >
                <MyText style={styles.modalButtons}>Cancel</MyText>
              </TouchableHighlight>
              <MyText style={styles.modalTitle}>Filter Users</MyText>
              <TouchableHighlight
                onPress={() => {
                  setNameFilter('');
                  setEmailFilter('');
                  setModalVisible(false);
                  onModalVisibleChange(false);
                }}
                underlayColor='transparent'
              >
                <MyText style={styles.modalButtons}>Reset</MyText>
              </TouchableHighlight>
            </View>

            <View style={styles.modalSectionTitleView}>
              <MyText style={styles.modalSectionTitle}>Sort By</MyText>
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
            <View style={styles.applyButtonContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  applyFilters();
                }}
              >
                <MyText style={styles.applyButtonText}>Apply</MyText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default UserFilter;
