/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { APIClientProvider } from './api/APIClientContext';

const RootComponent = () => (
  <APIClientProvider>
    <App />
  </APIClientProvider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
