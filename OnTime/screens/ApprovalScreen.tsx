import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {useTheme} from '../theme/Colors';
import styles from '../theme/Styles';
import MyText from '../components/MyText';
import TimeRecord from '../models/TimeRecord';
import TimeRecordAPI from '../api/TimeRecordAPI';
import {useAPIClient} from '../api/APIClientContext';
import TimeRecordApprovalItem from '../components/time-record-approval-item/time-record-approval-item';
import Jobsite from '../models/Jobsite';
import JobsiteAPI from '../api/JobsiteAPI';
import TimeRecordUpdateForm from '../components/time-record/time-record-update-form';

function ApprovalScreen(): React.ReactElement {
  const {colors} = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);

  const {apiClient} = useAPIClient();
  const timeRecordAPI = new TimeRecordAPI(apiClient);
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [timeRecordUpdate, setTimeRecordUpdate] = useState<
    TimeRecord | undefined
  >(undefined);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: overlayVisible ? 0.5 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [overlayVisible]);

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 400,
    },
  });

  useEffect(() => {
    fetchTimeRecords();
    getJobsites();
  }, []);

  const fetchTimeRecords = useCallback(async () => {
    setLoading(true);
    try {
      const timeRecordsData: TimeRecord[] =
        await timeRecordAPI.getAllTimeRecords({status: 'pending'});

      setTimeRecords(timeRecordsData);
    } catch (error) {
      console.error('Error fetching time records:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRecordAPI]);

  const getJobsites = async () => {
    setLoading(true);
    try {
      const jobsitesData = await jobsiteAPI.getAllJobsites();
      setJobsites(jobsitesData);
    } catch (error) {
      console.error('Error fetching jobsites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (newTimeRecord: TimeRecord) => {
    try {
      await timeRecordAPI.updateTimeRecord(newTimeRecord._id, newTimeRecord);
      await fetchTimeRecords();
    } catch (error) {
      console.error('Error updating new timesheet:', error);
    } finally {
      setEditModalOpen(false);
      setOverlayVisible(false);
    }
  };

  const onClose = () => {
    setEditModalOpen(false);
    setOverlayVisible(false);
  };

  return loading ? (
    <ActivityIndicator
      size="large"
      style={styles.loadingContainer}></ActivityIndicator>
  ) : (
    <ScrollView style={{backgroundColor: colors.background}}>
      {timeRecords.map((record, index) => {
        return (
          <TimeRecordApprovalItem
            refreshRecords={fetchTimeRecords}
            onEditSelect={_timeRecord => {
              setTimeRecordUpdate(_timeRecord);
              setEditModalOpen(true);
              setOverlayVisible(true);
            }}
            timeRecord={record}
            key={index}
          />
        );
      })}

      <Modal
        style={styles.modalContainer}
        transparent={true}
        visible={editModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setEditModalOpen(false);
          setOverlayVisible(false);
        }}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
              setEditModalOpen(false);
              setOverlayVisible(false);
            }
          }>
          {timeRecordUpdate && (
            <TimeRecordUpdateForm
              timeRecord={timeRecordUpdate}
              jobsites={jobsites}
              onUpdate={onUpdate}
              onClose={onClose}
            />
          )}
        </TouchableOpacity>
      </Modal>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'black',
          opacity: overlayOpacity,
        }}
        pointerEvents={overlayVisible ? 'auto' : 'none'}
      />
    </ScrollView>
  );
}

export default ApprovalScreen;
