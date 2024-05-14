// APIClientContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import APIClient from './APIClient';
import User from '../models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../utils/authUtils';

// Define the type for the context to include the API client and any other values you might need
type APIClientContextType = {
  apiClient: APIClient;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create the context
const APIClientContext = createContext<APIClientContextType | undefined>(undefined);

// Export the useAPIClient hook for easy access to the context
export const useAPIClient = () => {
  const context = useContext(APIClientContext);
  if (context === undefined) {
    throw new Error('useAPIClient must be used within an APIClientProvider');
  }
  return context;
};

// API Client Provider component
export const APIClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          setIsAuthenticated(true);
          setUser({
            _id: decoded._id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            roles: decoded.roles,
          });
        } else {
          // Handle case where token is invalid or expired
          handleAuthFailure();
        }
      }
    };

    initializeAuth();
  }, []);

  // Setup the API client with an onAuthFailure callback that clears authentication
  const handleAuthFailure = () => {
    setIsAuthenticated(false);
    setUser(null);
    AsyncStorage.removeItem('userToken');
    // Add any additional logout or cleanup logic here
  };

  const apiClient = new APIClient(handleAuthFailure);

  return (
    <APIClientContext.Provider value={{ apiClient, isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </APIClientContext.Provider>
  );
};
