// Manage Users!
//  View Users - In a List
//  Add users
//  Edit Users/Update
//  Delete users
//
import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, Alert } from 'react-native'
import UserAPI from '../api/UserAPI'
import type User from '../models/User'

const UserManagement: React.FC = () => {
  // State for managing users
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers()
  }, [])

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const usersData = await UserAPI.getAllUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  // Function to handle user deletion
  const handleDeleteUser = async (userId: string) => {
    // Display confirmation dialog
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            // Call API to delete user
            try {
              await UserAPI.deleteUser(userId)
              // Refetch users after deletion
              fetchUsers()
            } catch (error) {
              console.error('Error deleting user:', error)
              // Handle error
            }
          }
        }
      ],
      { cancelable: false }
    )
  }

  return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* User list */}
            {loading
              ? (
                <Text>Loading...</Text>
                )
              : (
                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text>{item.firstName} {item.lastName}</Text>
                            </View>
                            <Button title="Edit" onPress={() => { console.log('Edit user button pressed') }} />
                            <Button title="Delete" onPress={async () => { await handleDeleteUser(item._id) }} />
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                />
                )}

            {/* Add User Button */}
            <Button title="Add User" onPress={() => { console.log('Add user button pressed') }} />
        </View>
  )
}

export default UserManagement
