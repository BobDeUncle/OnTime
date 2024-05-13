import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import MyText from '../components/MyText';
import NewUserButton from '../components/user/user-modal-button';
import UserFilter from '../components/user/user-filter';
import UserAPI from '../api/UserAPI';
import { useAPIClient } from '../api/APIClientContext';
import { useTheme } from '../theme/Colors';
import User from '../models/User';  // Ensure this import is correct

const UserManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const { apiClient } = useAPIClient();
  const userAPI = new UserAPI(apiClient);

  const [users, setUsers] = useState<User[]>([]);  // Explicitly type the state
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userAPI.getAllUsers();  // Assuming it takes a query to filter users
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchUsers();
  }

  const handleApplyFilter = (filters: any) => {
    console.log('Filters applied:', filters);
    // Implement the filter logic or refresh the list based on the filters
    fetchUsers();  // Refresh with new filters
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <MyText style={{...styles.headerText, flex: 3}}>Name</MyText>
      <MyText style={{...styles.headerText, flex: 3}}>Email</MyText>
      <MyText style={{ ...styles.headerText, flex: 1 }} children={undefined}></MyText>
    </View>
  );

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userRow}>
      <MyText style={{...styles.userText, flex: 3}}>{item.firstName} {item.lastName}</MyText>
      <MyText style={{...styles.userText, flex: 3}}>{item.email}</MyText>
      <TouchableOpacity style={[styles.actionButton, { flex: 1 }]} onPress={() => console.log('Edit/Delete user', item)}>
        <FontAwesomeIcon icon='ellipsis-v' size={20} color={colors.opText} />
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    searchBar: {
      flexDirection: 'row',
      flex: 0.7,
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
    userRow: {
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
    userText: {
      color: colors.opText,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.background }}>
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
            <NewUserButton onModalVisibleChange={setOverlayVisible} />
          </View>
          <View style={styles.filterView}>
            <UserFilter onApply={handleApplyFilter} onModalVisibleChange={setOverlayVisible} />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            ListHeaderComponent={renderHeader}
            data={users}
            renderItem={renderUser}
            keyExtractor={item => item._id}
            ListEmptyComponent={<MyText>No users found.</MyText>}
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

export default UserManagementScreen;
