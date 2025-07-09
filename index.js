/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeUnistyles } from './src/styles/unistyles';

// Initialize Unistyles before app registration
initializeUnistyles();

AppRegistry.registerComponent(appName, () => App);
