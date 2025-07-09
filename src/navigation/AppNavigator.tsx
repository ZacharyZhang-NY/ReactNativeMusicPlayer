import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import ArtistsScreen from '../screens/ArtistsScreen';
import AlbumsScreen from '../screens/AlbumsScreen';
import TracksScreen from '../screens/TracksScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Artists"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Artists" 
          component={ArtistsScreen}
          options={{ title: '艺术家' }}
        />
        <Stack.Screen 
          name="Albums" 
          component={AlbumsScreen}
          options={{ title: '专辑' }}
        />
        <Stack.Screen 
          name="Tracks" 
          component={TracksScreen}
          options={{ title: '歌曲' }}
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{ title: '播放器', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;