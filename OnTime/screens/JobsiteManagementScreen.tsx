import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import MyText from '../components/MyText';
import NewJobsiteButton from '../components/jobsite/jobsite-modal-button';
import EditJobsiteButton from '../components/jobsite/edit-jobsite-modal-button';
import JobsiteFilter from '../components/jobsite/jobsite-filter';
import JobsiteAPI from '../api/JobsiteAPI';
import { useAPIClient } from '../api/APIClientContext';
import { useTheme } from '../theme/Colors';
import Jobsite from '../models/Jobsite'; 
import { storageEmitter } from '../components/storageEmitter';

const JobsiteManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const { apiClient } = useAPIClient();
  const jobsiteAPI = new JobsiteAPI(apiClient);

  const [jobsites, setJobsites] = useState<Jobsite[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchJobsites();
    storageEmitter.on('jobsitesUpdated', refreshList);

    return () => {
      storageEmitter.off('jobsitesUpdated', refreshList);
    };
  }, []);

  useEffect(() => {
    fetchJobsites();
  }, [searchQuery]);

  const fetchJobsites = useCallback(async (params: {[key: string]: any} = {}) => {
    setLoading(true);
    params.search = searchQuery;
    try {
      const fetchedJobsites = await jobsiteAPI.getAllJobsites(params);
      setJobsites(fetchedJobsites);
    } catch (error) {
      console.error('Error fetching jobsites:', error);
    } finally {
      setLoading(false);
    }
  }, [jobsiteAPI]);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: overlayVisible ? 0.5 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [overlayVisible]);

  useEffect(() => {
    const searchTimerId = setTimeout(() => {
      refreshList();
    }, 500);
  
    return () => {
      clearTimeout(searchTimerId);
    };
  }, [searchQuery]);

  const refreshList = () => {
    fetchJobsites();
  }

  const handleApplyFilter = (filters: any) => {
    console.log('Filters applied:', filters);
    // Implement the filter logic or refresh the list based on the filters
    fetchJobsites(filters);  // Refresh with new filters
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <MyText style={{...styles.headerText, flex: 3}}>Name</MyText>
      <MyText style={{...styles.headerText, flex: 3}}>City</MyText>
      <MyText style={{ ...styles.headerText, flex: 1 }} children={undefined}></MyText>
    </View>
  );

  const renderJobsite = ({ item }: { item: Jobsite }) => (
    <View style={styles.jobsiteRow}>
      <MyText style={{...styles.jobsiteText, flex: 3}}>{item.name}</MyText>
      <MyText style={{...styles.jobsiteText, flex: 3}}>{item.city}</MyText>
      <View>
        <EditJobsiteButton jobsite={item} onModalVisibleChange={setOverlayVisible} refreshList={refreshList} />
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    searchBar: {
      flexDirection: 'row',
      flex: 0.85,
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      margin: 10,
      padding: 10,
    },
    searchInput: {
      flex: 1,
      color: colors.opText,
    },
    placeholderText: {
      color: colors.border,
      fontSize: 14,
    },
    filterView: {
      flex: 0.15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 5,
    },
    headerRow: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: colors.border,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    jobsiteRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor: colors.background,
    },
    headerText: {
      color: 'white',
      fontWeight: 'bold',
    },
    jobsiteText: {
      color: colors.opText,
    },
    emptyListText: {
      textAlign: 'center',
      color: colors.opText,
      marginTop: 20,
      fontSize: 16,
      paddingHorizontal: 20,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <View style={styles.row}>
          <View style={styles.searchBar}>
            <TextInput
              onChangeText={setSearchQuery}
              value={searchQuery}
              placeholder="Search"
              placeholderTextColor={styles.placeholderText.color}
              style={styles.searchInput}
            />
            <FontAwesomeIcon icon='search' size={20} color={colors.border} />
          </View>
          <View style={styles.filterView}>
            <NewJobsiteButton onModalVisibleChange={setOverlayVisible} />
          </View>
          {/* <View style={styles.filterView}>
            <UserFilter onApply={handleApplyFilter} onModalVisibleChange={setOverlayVisible} />
          </View> */}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            ListHeaderComponent={renderHeader}
            data={jobsites}
            renderItem={renderJobsite}
            keyExtractor={item => item._id}
            ListEmptyComponent={<MyText style={styles.emptyListText}>No jobsites found.</MyText>}
          />
        )}
      </View>
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
    </View>
  );
};

export default JobsiteManagementScreen;
