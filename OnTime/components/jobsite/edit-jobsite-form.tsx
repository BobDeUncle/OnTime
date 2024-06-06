import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import JobsiteAPI from '../../api/JobsiteAPI';
import JobsiteWithSupervisor from '../../models/JobsiteWithSupervisor';
import { useAPIClient } from '../../api/APIClientContext';

interface JobsiteFormProps {
  jobsite: JobsiteWithSupervisor;
  styles: any;
  showCloseButton: boolean;
  onClose: () => void;
}

const EditJobsiteForm: React.FC<JobsiteFormProps> = ({ jobsite, styles, showCloseButton, onClose }) => {
  const { colors } = useTheme();

  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState(jobsite?.jobsite.name || '');
  const [city, setCity] = useState(jobsite?.jobsite.city || '');
  const cityRef = useRef<TextInput>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameValid, setNameValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    setFormSubmitted(true);

    // Validate inputs
    const isNameValid = name.trim().length > 0;
    const isCityValid = city.trim().length > 0;

    // Update validation status
    setNameValid(isNameValid);
    setCityValid(isCityValid);

    if (!isNameValid || !isCityValid) {
      setLoading(false);
      return;
    }

    // Show a confirmation popup
    Alert.alert(
      'Update Jobsite',
      `Do you wish to update the jobsite named ${name} located in ${city}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              await jobsiteAPI.updateJobsite(jobsite.jobsite._id, {
                name,
                city,
              });

              saveJobsite();
              if (onClose) onClose();
            } catch (error) {
              console.error('Error updating jobsite:', error);
              Alert.alert(
                'Error',
                'Failed to update jobsite. Please try again later.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const saveJobsite = async () => {
    storageEmitter.emit('jobsitesUpdated');
  };

  const localStyles = StyleSheet.create({
    timesheetView: {},
    invalidForm: {
      color: colors.warning,
      paddingBottom: 10,
    },
    invalidFormIcon: {
      color: colors.warning,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      padding: 10,
      paddingTop: 0,
      paddingRight: 0,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    textInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
    },
    text: {
      color: colors.border,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>Edit Jobsite</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text} />
          </Pressable>
        )}
      </View>
      <TextInput
        style={{
          ...localStyles.textInput,
          borderColor: nameValid ? colors.border : colors.warning,
        }}
        placeholder="Name"
        placeholderTextColor={localStyles.placeholderText.color}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setNameValid(text.trim().length > 0);
        }}
        returnKeyType="next"
        onSubmitEditing={() => cityRef.current?.focus()}
        blurOnSubmit={false}
      />
      {!nameValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon} /> Invalid Name
        </MyText>
      )}
      <TextInput
        ref={cityRef}
        style={{
          ...localStyles.textInput,
          borderColor: cityValid ? colors.border : colors.warning,
          marginBottom: 10,
        }}
        placeholder="City"
        placeholderTextColor={localStyles.placeholderText.color}
        value={city}
        onChangeText={(text) => {
          setCity(text);
          setCityValid(text.trim().length > 0);
        }}
        returnKeyType="done"
      />
      {!cityValid && (
        <MyText style={localStyles.invalidForm}>
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon} /> Invalid City
        </MyText>
      )}
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

export default EditJobsiteForm;
