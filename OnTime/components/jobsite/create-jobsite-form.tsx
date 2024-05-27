import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Pressable, Switch } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import JobsiteAPI from '../../api/JobsiteAPI';
import { useAPIClient } from '../../api/APIClientContext';

interface JobsiteFormProps {
  styles: any;
  showCloseButton: boolean,
  onClose: () => void;
}

const JobsiteForm: React.FC<JobsiteFormProps> = ({ styles, showCloseButton, onClose }) => {  
  const {colors} = useTheme();
  const { user } = useAPIClient(); 

  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
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

    // If any input is invalid, return early
    if (!isNameValid || !isCityValid) {
      setLoading(false);
      return;
    }

    // Show a confirmation popup
    Alert.alert(
      'Submit New Jobsite',
      `Do you wish to create a new jobsite named ${name} located in ${city}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              await jobsiteAPI.addJobsite({
                name,
                city,
              });

              saveJobsite();
              if (onClose) onClose();
            } catch (error) {
              console.error('Error creating jobsite:', error);
              Alert.alert(
                'Error',
                'Failed to create jobsite. Please try again later.',
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
    dropdownInputIOS: {
      color: colors.text,
      paddingTop: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownInputAndroid: {
      color: colors.text,
      borderWidth: 1,
      borderRadius: 4,
    },
    dropdownIcon: {
      top: 6,
      right: 10,
    },
    dateTimeInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 8,
      paddingLeft: 10,
      color: colors.text,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
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
    container: {
      flex: 1,
      paddingTop: 10
    },
    roleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      paddingVertical: 3,
      paddingLeft: 10,
      paddingRight: 5,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
    },
    roleText: {
      color: colors.border,
      fontSize: 14,
    },
    switch: {
      transform: [{ scaleX: .8 }, { scaleY: .8 }]
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>New Jobsite</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text}/>
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
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid Name
        </MyText>
      )}
      <TextInput
        ref={cityRef}
        style={{
          ...localStyles.textInput,
          borderColor: cityValid ? colors.border : colors.warning,
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
          <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon}/> Invalid City
        </MyText>
      )}
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

export default JobsiteForm;
