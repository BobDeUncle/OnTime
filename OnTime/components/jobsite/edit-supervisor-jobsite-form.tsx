import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Pressable, Button, ActivityIndicator } from 'react-native';
import MyText from '../MyText';
import { useTheme } from '../../theme/Colors';
import { storageEmitter } from '../storageEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import RNPickerSelect from 'react-native-picker-select';

import JobsiteAPI from '../../api/JobsiteAPI';
import UserAPI from '../../api/UserAPI';
import User from '../../models/User';
import JobsiteWithSupervisor from '../../models/JobsiteWithSupervisor';
import { useAPIClient } from '../../api/APIClientContext';

interface EditSupervisorFormProps {
  jobsite: JobsiteWithSupervisor;
  supervisors: User[];
  styles: any;
  showCloseButton: boolean;
  onClose: () => void;
}

const EditSupervisorForm: React.FC<EditSupervisorFormProps> = ({ jobsite, supervisors, styles, showCloseButton, onClose }) => {
  const { colors } = useTheme();

  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);
  const userAPI = new UserAPI(apiClient);

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSupervisors, setFetchingSupervisors] = useState<boolean>(true);
  const [supervisorId, setSupervisorId] = useState<string>('');
  const [supervisorValid, setSupervisorValid] = useState(true);
  const [availableSupervisors, setAvailableSupervisors] = useState<User[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const supervisorsData = await userAPI.getSupervisors();
        setAvailableSupervisors(supervisorsData);

        // Check if there's already a supervisor for the jobsite and set the initial value
        const currentSupervisor = supervisors.find(sup =>
          jobsite.supervisors.some(jsSup => jsSup._id === sup._id)
        );
        if (currentSupervisor && !supervisorId) {
          setSupervisorId(currentSupervisor._id);
        }
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      } finally {
        setFetchingSupervisors(false);
      }
    };

    fetchSupervisors();
  }, [userAPI, jobsite.supervisors, supervisors, supervisorId]);

  const handleSubmit = async () => {
    setLoading(true);

    // Validate inputs
    const isSupervisorValid = supervisorId.trim().length > 0;
    setSupervisorValid(isSupervisorValid);

    if (!isSupervisorValid) {
      setLoading(false);
      return;
    }

    const selectedSupervisor = availableSupervisors.find(sup => sup._id === supervisorId);

    // Show a confirmation popup
    Alert.alert(
      'Submit New Supervisor',
      `Do you wish to add ${selectedSupervisor?.firstName} ${selectedSupervisor?.lastName} as the supervisor for ${jobsite.jobsite.name}?`,
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
              // Remove existing supervisor if there is one
              if (jobsite.supervisors.length > 0) {
                await Promise.all(
                  jobsite.supervisors.map(async (sup) => {
                    await jobsiteAPI.removeSupervisor(jobsite.jobsite._id, sup._id);
                  })
                );
              }

              // Add the new supervisor
              await jobsiteAPI.addSupervisor(jobsite.jobsite._id, supervisorId);

              saveSupervisor();
              if (onClose) onClose();
            } catch (error) {
              console.error('Error adding supervisor:', error);
              Alert.alert(
                'Error',
                'Failed to add supervisor. Please try again later.',
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

  const saveSupervisor = async () => {
    storageEmitter.emit('jobsitesUpdated');
  };

  const localStyles = StyleSheet.create({
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
  });

  return (
    <View style={styles.section}>
      <View style={localStyles.row}>
        <MyText style={styles.sectionTitle}>Edit Supervisors</MyText>
        {showCloseButton && (
          <Pressable onPress={onClose} style={localStyles.closeButton}>
            <FontAwesomeIcon icon='times' size={26} color={colors.text} />
          </Pressable>
        )}
      </View>
      {fetchingSupervisors ? (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : (
        <>
          <RNPickerSelect
            onValueChange={(value) => {
              setSupervisorId(value);
              setSupervisorValid(value.trim().length > 0);
            }}
            value={supervisorId}
            items={availableSupervisors.map((sup) => ({ label: `${sup.firstName} ${sup.lastName}`, value: sup._id }))}
            placeholder={{}}
            style={{
              inputIOS: {
                ...localStyles.textInput,
                borderColor: supervisorValid ? colors.border : colors.warning,
              },
              inputAndroid: {
                ...localStyles.textInput,
                borderColor: supervisorValid ? colors.border : colors.warning,
              },
              placeholder: localStyles.placeholderText,
            }}
          />
          {!supervisorValid && (
            <MyText style={localStyles.invalidForm}>
              <FontAwesomeIcon icon='exclamation' style={localStyles.invalidFormIcon} /> Invalid Supervisor
            </MyText>
          )}
          <Button title="Submit" onPress={handleSubmit} disabled={loading} />
        </>
      )}
    </View>
  );
};

export default EditSupervisorForm;
