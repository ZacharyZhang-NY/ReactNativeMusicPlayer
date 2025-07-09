import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <AppNavigator />
    </>
  );
}

export default App;
