// APIClientContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import APIClient from './APIClient';

// Define the type for the context to include the API client and any other values you might need
type APIClientContextType = {
  apiClient: APIClient;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
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

  // Setup the API client with an onAuthFailure callback that clears authentication
  const handleAuthFailure = () => {
    setIsAuthenticated(false);
    // Add any additional logout or cleanup logic here
  };

  const apiClient = new APIClient(handleAuthFailure);

  return (
    <APIClientContext.Provider value={{ apiClient, isAuthenticated, setIsAuthenticated }}>
      {children}
    </APIClientContext.Provider>
  );
};
